import SimpleSchema from "simpl-schema";
import getCartById from "../util/getCartById.js";
import cartCatalogsRefresh from "../util/cartCatalogsRefresh.js";
const inputSchema = new SimpleSchema({
  cartId: String,
  catalogs: {
    type: Array,
    minCount: 1,
  },
  "catalogs.$": Object,
  "catalogs.$.cartCatalogId": String,
  "catalogs.$.quantity": {
    type: SimpleSchema.Integer,
    min: 0,
  },
  cartToken: {
    type: String,
    optional: true,
  },
});

/**
 * @method updateCartCatalogsQuantity
 * @summary Sets a new quantity for one or more catalogs in a cart
 * @param {Object} context -  an object containing the per-request state
 * @param {Object} input - Necessary input
 * @param {String} input.cartId - The ID of the cart in which all of the catalogs exist
 * @param {String} input.catalogs - Array of catalogs to update
 * @param {Number} input.catalogs.cartCatalogId - The cart catalog ID
 * @param {Object} input.catalogs.quantity - The new quantity, which must be an integer of 0 or greater
 * @param {String} input.cartToken - The cartToken if the cart is an anonymous cart
 * @returns {Promise<Object>} An object containing the updated cart in a `cart` property
 */
export default async function updateCartCatalogsQuantity(context, input) {
  inputSchema.validate(input || {});

  const { cartId, catalogs, cartToken } = input;

  const cart = await getCartById(context, cartId, { cartToken, throwIfNotFound: true });
  // let items = cart.items;
  // const updatedCatalogs = cart.catalogs.reduce((list, catalog) => {
  //   const update = catalogs.find(({ cartCatalogId }) => cartCatalogId === catalog._id);
  //   console.info("updateCartCatalogsQuantity : update", update);
  //   if (!update) {
  //     list.push({ ...catalog });
  //   } else if (update.quantity > 0) {
  //     let priceTotal = 0.0
  //     items.map((item) => {
  //       if (item.cartCatalogId !== update.cartCatalogId) return item;
  //       // Match
  //       const total = item.subtotal.base * update.quantity;
  //       item.subtotal.amount = +accounting.toFixed(total, 3);
  //       priceTotal += total;
  //     });
  //     // Update quantity as instructed, while omitting the catalog if quantity is 0
  //     list.push({
  //       ...catalog,
  //       quantity: update.quantity,
  //       // Update the subtotal since it is a multiple of the price
  //       subtotal: {
  //         amount: priceTotal,
  //         currencyCode: catalog.subtotal.currencyCode,
  //       },
  //     });
  //     console.info("updateCartCatalogsQuantity : quantity, priceTotal", update.quantity, priceTotal);
  //   }
  //   return list;
  // }, []);

  const updatedCart = {
    ...cart,
    ...cartCatalogsRefresh({catalogs: cart.catalogs, items:cart.items, ucatalogs: catalogs}).updated,
    updatedAt: new Date(),
  };

  const savedCart = await context.mutations.saveCart(context, updatedCart);

  return { cart: savedCart };
}
