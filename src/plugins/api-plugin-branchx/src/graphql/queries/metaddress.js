import { GoogleMapsService } from "../services/index.js";
/**
 * @name metaddress
 * @method
 * @memberof Branch/NoMeteorQueries
 * @summary Query the meta adreess collection for branch
 * @param {Object} context - an object containing the per-request state
 * @param {Object} params - request parameters
 * @param {String} params.point - Geo point to address
 * @returns {Promise<Object>|undefined} - An Array of Order documents, if found
 */
export default async function metaddress(context, { point, shopId }) {
  const { collections } = context;
  const { Branches } = collections;
  const query = {
    shopId,
    "geographyData.point": { $near: { $geometry: point } },
    "active": true
  };
  const data = await Branches.findOne(query);
  const _metaddress = await GoogleMapsService.serviceGeoCode(point);
  _metaddress.distance = await GoogleMapsService.serviceDistanceMatrix(
    data.geographyData.point,
    point
  );
  _metaddress.distance.branchId = data._id;
  _metaddress.distance.branch = data.generalData.name;
  return _metaddress;
}
