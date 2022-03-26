export default async function productsVariantsStartup(context) {
  const schema = {
    multipleOption: {
      type: Boolean,
      optional: true,
    },
    minOption: {
      type: Number,
      min: 0,
      optional: true,
    },
    maxOption: {
      type: Number,
      min: 0,
      optional: true,
    },
  };
  context.simpleSchemas.ProductVariant.extend(schema);

  context.simpleSchemas.CatalogProductVariant.extend(schema);

  await context.appEvents.on(
    "publishProductToCatalog",
    async (catalogProduct, { variants }) => {
  console.info("Publish", catalogProduct, variants);
      for (const variant of catalogProduct.variants || []) {
        const baseVariant = (variants || []).find((v) => v._id === variant._id);
        if (!baseVariant) continue;
        for (const field of ["minOption", "maxOption", "multipleOption"])
          variant[field] = baseVariant[field];
        console.info("final", variant);
      }
    }
  );
}
