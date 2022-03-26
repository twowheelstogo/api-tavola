export default async function publishProductToCatalog(
    catalogProduct,
    { context, product, variants }
  ) {
    for (const variant of catalogProduct.variants || []) {
      const baseVariant = (variants || []).find((v) => v._id === variant._id);
      if (!baseVariant) {
          console.info("the variant not found or is not visible", variant);
        continue;
      }
      for (const field of ["minOption", "maxOption", "multipleOption"])
        variant[field] = baseVariant[field];
  console.info("final", variant);
    }
  }