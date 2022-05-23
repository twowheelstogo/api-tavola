import Random from "@reactioncommerce/random";
import SimpleSchema from "simpl-schema";
import accounting from "accounting-js";
import lodash from "lodash"
import ReactionError from "@reactioncommerce/reaction-error";
export default async function addCartCatalogs(
  context,
  cart,
  input,
  options = {}
) {
  const { queries } = context;
  const incorrectPriceFailures = [];
  const minOrderQuantityFailures = [];
  const maxOrderQuantityFailures = [];
  const updated = {
    items: items.catalogs || [],
    catalogs: cart.catalogs || [],
  };
  const catalogs = {};
  ///|\\\|///|\\\|///|\\\
  ///      Items
  ///|\\\|///|\\\|///|\\\
  await Promise.all(
    input.items
      .map(async (inputItem) => {
        const {
          metafields,
          productConfiguration,
          quantity,
          price,
          cartCatalogId,
        } = inputItem;
        if (!productConfiguration) {
          // console.info(
          //   "Error addCartCatalog productConfiguration",
          //   productConfiguration
          // );
          return null;
        }
        const { productId, productVariantId } = productConfiguration;

        // Get the published product from the DB, in order to get variant title and check price.
        // This could be done outside of the loop to reduce db hits, but 99% of the time inputItems
        // will have only one item, so we can skip that optimization for now in favor of cleaner code.
        const {
          catalogProduct,
          parentVariant,
          variant: chosenVariant,
        } = await queries.findProductAndVariant(
          context,
          productId,
          productVariantId
        );

        const variantPriceInfo = await queries.getVariantPrice(
          context,
          chosenVariant,
          price.currencyCode
        );
        if (!variantPriceInfo) {
          throw new ReactionError(
            "invalid-param",
            `This product variant does not have a price for ${price.currencyCode}`
          );
        }
        ///|\\\|///|\\\|///|\\\
        ///      Catalogs
        ///|\\\|///|\\\|///|\\\
        if (!catalogs[cartCatalogId]) {
          catalogs[cartCatalogId] = {
            product: catalogProduct,
            catalog: {
              _id: cartCatalogId,
              quantity: 1,
              shopId: catalogProduct.shopId,
              title: catalogProduct.title,
              updatedAt: currentDateTime,
              addedAt: currentDateTime,
              createdAt: currentDateTime,
              subtotal: { currencyCode: price.currencyCode },
              price: {
                ...lodash.pick(catalogProduct.pricing[price.currencyCode], [
                  "maxFreeQty",
                  "maxQty",
                  "minQty",
                ]),
              },
              ...(cart.catalogs || []).find((c) => c._id === cartCatalogId),
              ...(input.catalogs || []).find((c) => c._id === cartCatalogId),
            },
            variants: {},
          };
          catalogs[cartCatalogId].catalog.subtotal.currencyCode =
            price.currencyCode;
        }
        ///|\\\|///|\\\|///|\\\
        ///      variants
        ///|\\\|///|\\\|///|\\\ 
        if (!catalogs[cartCatalogId].variants[parentVariant.variantId])
          catalogs[cartCatalogId].variants[parentVariant.variantId] = {
            variant: parentVariant,
            pricing: {
              maxFreeQty: 0,
              ...parentVariant.pricing[price.currencyCode],
            },
            items: {},
          };
        ///|\\\|///|\\\|///|\\\
        ///      options
        ///|\\\|///|\\\|///|\\\ 
        catalogs[cartCatalogId].variants[parentVariant.variantId].items[
          chosenVariant.variantId
        ] = {
          option: chosenVariant,
          pricing: {
            maxFreeQty: 0,
            ...chosenVariant.pricing[price.currencyCode],
          },
          item: {
            addedAt: currentDateTime,
            createdAt: currentDateTime,
            ...(cart.items || []).find(
              (i) =>
                i.productId === productId && i.variantId === productVariantId
            ),
            _id: Random.id(),
            cartCatalogId,
            attributes: [
              ...(parentVariant
                ? {
                    label: parentVariant.attributeLabel,
                    value: parentVariant.optionTitle,
                  }
                : []),
              {
                label: chosenVariant.attributeLabel,
                value: chosenVariant.optionTitle,
              },
            ],
            isTaxable: chosenVariant.isTaxable || false,
            metafields,
            optionTitle: chosenVariant.optionTitle,
            parcel: chosenVariant.parcel,
            // This one will be kept updated by event handler watching for
            // catalog changes whereas `priceWhenAdded` will not.
            price: {
              amount: variantPriceInfo.price,
              currencyCode: price.currencyCode,
              ...lodash.pick(chosenVariant.pricing[price.currencyCode], [
                "maxFreeQty",
                "maxQty",
                "minQty",
              ]),
              variant: {
                _id: parentVariant.variantId,
                maxFreeQty: 0,
                ...parentVariant.pricing[price.currencyCode],
              },
            },
            priceWhenAdded: {
              amount: variantPriceInfo.price,
              currencyCode: price.currencyCode,
            },
            compareAtPrice:
              variantPriceInfo.compareAtPrice &&
              variantPriceInfo.compareAtPrice > 0
                ? {
                    amount: variantPriceInfo.compareAtPrice,
                    currencyCode: price.currencyCode,
                  }
                : null,
            productId,
            productSlug: catalogProduct.slug,
            productVendor: catalogProduct.vendor,
            productType: catalogProduct.type,
            productTagIds: catalogProduct.tagIds,
            quantity,
            shopId: catalogProduct.shopId,
            // Subtotal will be kept updated by event handler watching for catalog changes.
            subtotal: {
              amount: +accounting.toFixed(variantPriceInfo.price * quantity, 3),
              currencyCode: price.currencyCode,
            },
            taxCode: chosenVariant.taxCode,
            title: catalogProduct.title,
            updatedAt: currentDateTime,
            variantId: productVariantId,
            variantTitle: chosenVariant.title,
          },
        };
      })
      .filter((h) => h)
  );
  // console.info(`\n\n==> { catalogs }\n`, catalogs, `\n`, ``);
  throw "Stop";
  ///|\\\|///|\\\|///|\\\
  ///      Return
  ///|\\\|///|\\\|///|\\\
  return cartCatalogsRefresh({ cart, catalogs: [], items: [] });
  ///|\\\|///|\\\|///|\\\
  ///      Validations & Calculate Price
  ///|\\\|///|\\\|///|\\\
  for (const [_, catalog] of Object.entries(catalogs)) {
    let priceTotal = 0.0;
    for (const [variantId, variant] of Object.entries(catalog.variants)) {
      let qtyTotal = 0;
      let maxFreeQty = variant.pricing.maxFreeQty;
      for (const [__, item] of Object.entries(variant.items).sort(
        (a, b) => a[1].pricing.price - b[1].pricing.price
      )) {
        qtyTotal += item.item.quantity;
        let finalQty =
          item.item.quantity - maxFreeQty - item.pricing.maxFreeQty;
        if (finalQty <= 0) finalQty = 0;
        const subtotal = item.pricing.price * finalQty;
        const total = subtotal * catalog.catalog.quantity;
        item.item.subtotal.amount = +accounting.toFixed(total, 3);
        item.item.subtotal.base = subtotal;
        priceTotal += total;
        //
        maxFreeQty -= item.item.quantity - item.pricing.maxFreeQty;
        if (maxFreeQty < 0) maxFreeQty = 0;
      }
      ///|\\\|///|\\\|///|\\\
      ///      Validation
      ///|\\\|///|\\\|///|\\\
      if (variant.pricing.minQty && variant.pricing.minQty > qtyTotal) {
        minOrderQuantityFailures.push({
          minOrderQuantity: variant.pricing.minQty,
          productConfiguration: {
            productId: catalog.product.productId,
            productVariantId: variantId,
          },
          quantity,
        });
      }
      if (variant.pricing.maxQty && variant.pricing.maxQty < qtyTotal) {
        maxOrderQuantityFailures.push({
          maxOrderQuantity: variant.pricing.maxQty,
          productConfiguration: {
            productId: catalog.product.productId,
            productVariantId: variantId,
          },
          quantity,
        });
      }
    }
    ///|\\\|///|\\\|///|\\\
    ///      Total
    ///|\\\|///|\\\|///|\\\
    catalog.catalog.subtotal.amount = +accounting.toFixed(priceTotal, 3);
  }
  
  //   ///|\\\|///|\\\|///|\\\
  //   ///      Init
  //   ///|\\\|///|\\\|///|\\\
  //   let cartCatalogIds = Object.keys(catalogs);

  //   ///|\\\|///|\\\|///|\\\
  //   ///      Catalogs:Clean
  //   ///|\\\|///|\\\|///|\\\
  //   updated.catalogs = (cart.catalogs || [])
  //     .filter((c) => !cartCatalogIds.includes(c._id))
  //     .concat(Object.values(catalogs).map((c) => c.catalog))
  //     .filter((c) => c.quantity)
  //     .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
  //   const hasQtycartCatalogIds = updated.catalogs.map((c) => c._id);
  //   ///|\\\|///|\\\|///|\\\
  //   ///      Items: Clean
  //   ///|\\\|///|\\\|///|\\\
  //   updated.items = (cart.items || [])
  //     .filter(
  //       (i) =>
  //         !hasQtycartCatalogIds.includes(i.cartCatalogId) ||
  //         !cartCatalogIds.includes(i._id)
  //     )
  //     .concat(
  //       Object.values(catalogs)
  //         .map((c) =>
  //           Object.values(c.variants)
  //             .map((v) => Object.values(v.items).map((i) => i.item))
  //             .flat()
  //         )
  //         .flat()
  //     )
  //     .filter((i) => i.quantity)
  //     .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());

  //   console.info("addCartCatalogs", JSON.stringify(updated, null, 2));
  //   return {
  //     incorrectPriceFailures,
  //     maxOrderQuantityFailures,
  //     minOrderQuantityFailures,
  //     updated,
  //   };
}
