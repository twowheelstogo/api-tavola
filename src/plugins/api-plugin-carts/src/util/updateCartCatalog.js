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
    const update = opts.ucatalogs.find((ucatalog) => ucatalog._id === catalog._id);
    const cartCatalogId = (update || {})._id || catalog._id;
    const cartCatalogQty = (update || {}).quantity || catalog.quantity || 0;
    if (cartCatalogQty <= 0) {
      if (cartCatalogId) {
        opts.items = opts.items.filter((i) => i.cartCatalogId !== cartCatalogId);
      }
    } else {
      let priceTotal = 0.0;
      opts.items = opts.items.map((item) => {
        if (item.cartCatalogId !== cartCatalogId) return item;
        // Match
        const total = item.subtotal.base * update.quantity;
        item.subtotal.amount = +accounting.toFixed(total, 3);
        priceTotal += total;
      });
      // Update quantity as instructed, while omitting the catalog if quantity is 0
      list.push({
        ...catalog,
        quantity: update.quantity,
        // Update the subtotal since it is a multiple of the price
        subtotal: {
          amount: priceTotal,
          currencyCode: catalog.subtotal.currencyCode,
        },
      });
    }
    //   console.info("updateCartCatalogsQuantity : quantity, priceTotal", update.quantity, priceTotal);

    // console.info("updateCartCatalogsQuantity : update", update);
    // if (!update) {
    //   list.push({ ...catalog });
    // } else if (update.quantity > 0) {

    // }
    // return list;
  }, []);
}
