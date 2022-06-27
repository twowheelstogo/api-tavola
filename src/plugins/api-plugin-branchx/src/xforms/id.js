import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";

const namespaces = {
  Branch: "reaction/branch",
  Shop: "reaction/shop"
};

export const encodeBranchOpaqueId = encodeOpaqueId(namespaces.Branch);
export const decodeBranchOpaqueId = decodeOpaqueIdForNamespace(namespaces.Branch);

export const encodeShopOpaqueId = encodeOpaqueId(namespaces.Shop);
export const decodeShopOpaqueId = decodeOpaqueIdForNamespace(namespaces.Shop);
