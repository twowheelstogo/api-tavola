import SimpleSchema from "simpl-schema";
import getCartById from "../util/getCartById.js";
import cartCatalogsRefresh from "../util/cartCatalogsRefresh.js";

const inputSchema = new SimpleSchema({
  "cartId": String,
  "items": {
    type: Array,
    minCount: 1
  },
  "items.$": Object,
  "items.$.cartItemId": String,
  "items.$.quantity": {
    type: SimpleSchema.Integer,
    min: 0
  },
  "cartToken": {
    type: String,
    optional: true
  },
  "cartCatalogId": {
    type: String,
    optional: true
  }
});

/**
 * @method updateCartItemsQuantity
 * @summary Sets a new quantity for one or more items in a cart
 * @param {Object} context -  an object containing the per-request state
 * @param {Object} input - Necessary input
 * @param {String} input.cartId - The ID of the cart in which all of the items exist
 * @param {String} input.items - Array of items to update
 * @param {Number} input.items.cartItemId - The cart item ID
 * @param {Object} input.items.quantity - The new quantity, which must be an integer of 0 or greater
 * @param {String} input.cartToken - The cartToken if the cart is an anonymous cart
 * @returns {Promise<Object>} An object containing the updated cart in a `cart` property
 */
export default async function updateCartItemsQuantity(context, input) {
  inputSchema.validate(input || {});

  const { cartId, items, cartToken } = input;

  const cart = await getCartById(context, cartId, { cartToken, throwIfNotFound: true });

  // updated.catalogs = (cart.catalogs||[]).map((catalog) => {
  //   // let total = 
  //   for(const item of updated.items){
  //     if(item.cartCatlogId !== catalog._id)continue;
  //   }
  //   // const update = items.find(({ cartItemId }) => cartItemId === item._id);
  //   // if (!update) {
  //   //   list.push({ ...item });
  //   // } else if (update.quantity > 0) {
  //   //   // Update quantity as instructed, while omitting the item if quantity is 0
  //   //   list.push({
  //   //     ...item,
  //   //     quantity: update.quantity
  //   //   });
  //   // }
  //   // return list;
  // }),



  const updatedCart = {
    ...cart,
    // items: updatedItems,
    ...cartCatalogsRefresh({catalogs: cart.catalogs, items:cart.items.reduce((list, item) => {
      const update = items.find(({ cartItemId }) => cartItemId === item._id);
      if (!update) {
        list.push({ ...item });
      } else if (update.quantity > 0) {
        // Update quantity as instructed, while omitting the item if quantity is 0
        list.push({
          ...item,
          quantity: update.quantity
        });
      }
      return list;
    }, []) , ucatalogs: catalogs}).updated,
    updatedAt: new Date()
  };

  const savedCart = await context.mutations.saveCart(context, updatedCart);

  return { cart: savedCart };
}
