import lodash from "lodash"
import accounting from "accounting-js";
/**
 * @name cartCatalogsRefresh
 * @param {Object} opts - Required
 * @param {Array<Object>} opts.catalogs - Required
 * @param {Array<Object>} opts.ucatlogs - Required
 * @param {Array<Object>} opts.items - Required
 * @returns {Promise<Object>} - ...
 */
export default function cartCatalogsRefresh(opts) {
  opts.catalogs.reduce((list, catalog) => {
    // Init
    catalog = lodash.merge(
      { quantity: 0 },
      catalog,
      (opts.ucatalogs || []).find((_ucatalog) => _ucatalog._id === catalog._id)
    );
    // Removing
    if (catalog.quantity <= 0) {
      if (catalog._id) {
        opts.items = opts.items.filter((i) => i.catalog._id !== catalog._id);
      }
    } else {
      let priceTotal = 0.0;
      const variants = opts.items.reduce(
        (p, c) => ({
          ...p,
          [c.price.variant._id]: {
            ...p[c.price.variant._id],
            price: c.price.variant,
            items: ((p[c.price.variant._id] || {}).items || []).concat([c]),
          },
        }),
        {}
      );
      opts.items = [];
      for (const variant of Object.entries(variants)) {
        let qtyTotal = 0;
        let maxFreeQty = variant.price.maxFreeQty || 0;
        for (const item of variant.items.sort((a, b) => a[1].price.amount - b[1].price.amount)) {
          qtyTotal += item.quantity;
          let finalQty = item.quantity - maxFreeQty - (item.price.maxFreeQty || 0);
          if (finalQty <= 0) finalQty = 0;
          const subtotal = item.price.amount * finalQty;
          const total = subtotal * catalog.quantity;
          item.subtotal.amount = +accounting.toFixed(total, 3);
          item.subtotal.base = subtotal;
          priceTotal += total;
          //
          maxFreeQty -= item.quantity - (item.price.maxFreeQty || 0);
          if (maxFreeQty < 0) maxFreeQty = 0;
        }
        ///|\\\|///|\\\|///|\\\
        ///      Validation
        ///|\\\|///|\\\|///|\\\
        if (variant.price.minQty && variant.price.minQty > qtyTotal) {
          console.info("Error: minOrderQuantityFailures", {
            // minOrderQuantityFailures.push({
            minOrderQuantity: variant.price.minQty,
            productConfiguration: {
              productId: catalog.productId,
              productVariantId: variant._id,
            },
            quantity: item.quantity,
          });
        }
        if (variant.price.maxQty && variant.price.maxQty < qtyTotal) {
          console.info("Error: maxOrderQuantityFailures", {
            // maxOrderQuantityFailures.push({
            maxOrderQuantity: variant.price.maxQty,
            productConfiguration: {
              productId: catalog.productId,
              productVariantId: variant._id,
            },
            quantity: item.quantity,
          });
        }
        ///|\\\|///|\\\|///|\\\
        ///      Push
        ///|\\\|///|\\\|///|\\\
        opts.items.push(item);
      }

      ///|\\\|///|\\\|///|\\\
      ///      Total
      ///|\\\|///|\\\|///|\\\
      catalog.subtotal.amount = +accounting.toFixed(priceTotal, 3);
      ///|\\\|///|\\\|///|\\\
      ///      Push
      ///|\\\|///|\\\|///|\\\
      list.push(catalog);
    }
  }, []);

  //   ///|\\\|///|\\\|///|\\\
  // ///      Init
  // ///|\\\|///|\\\|///|\\\
  // let cartCatalogIds = Object.keys(catalogs);

  // ///|\\\|///|\\\|///|\\\
  // ///      Catalogs:Clean
  // ///|\\\|///|\\\|///|\\\
  // updated.catalogs = (cart.catalogs || [])
  //   .filter((c) => !cartCatalogIds.includes(c._id))
  //   .concat(Object.values(catalogs).map((c) => c.catalog))
  //   .filter((c) => c.quantity)
  //   .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
  // const hasQtycartCatalogIds = updated.catalogs.map((c) => c._id);
  // ///|\\\|///|\\\|///|\\\
  // ///      Items: Clean
  // ///|\\\|///|\\\|///|\\\
  // updated.items = (cart.items || [])
  //   .filter((i) => !hasQtycartCatalogIds.includes(i.cartCatalogId) || !cartCatalogIds.includes(i._id))
  //   .concat(
  //     Object.values(catalogs)
  //       .map((c) =>
  //         Object.values(c.variants)
  //           .map((v) => Object.values(v.items).map((i) => i.item))
  //           .flat()
  //       )
  //       .flat()
  //   )
  //   .filter((i) => i.quantity)
  //   .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
  ///|\\\|///|\\\|///|\\\
  ///      Return
  ///|\\\|///|\\\|///|\\\
  return {...opts, updated: lodash.pick(opts, ["catalogs", "items"])};
}
