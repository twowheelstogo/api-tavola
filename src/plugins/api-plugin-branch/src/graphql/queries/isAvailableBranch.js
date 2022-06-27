const getNowDayByTimeZone = (date, timeZone = "America/Guatemala") => {
  let now = date || new Date();
  let timeNow = "00:00";
  now = now.toLocaleString("es-GT", { timeZone });
  [now, timeNow] = now.split(" ");

  const [day, month, year] = now.split("/");
  now = new Date(+year, +month - 1, +day);

  const [hours, minutes] = timeNow.split(":");

  return { day: now.getDay(), time: +`${hours}${minutes}` };
};

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
export default async function isAvailableBranch(
  context,
  { branchId, date, shopId }
) {
  const { collections } = context;
  const { Branches } = collections;
  const query = {
    _id: branchId,
    active: true,
    shopId
  };
  const { day, time } = getNowDayByTimeZone(date);
  query[`scheduleData.${day}.isClosed`] = false;
  query[`scheduleData.${day}.scheduledOpenNumber`] = { $lte: time };
  query[`scheduleData.${day}.scheduledClosedNumber`] = { $gte: time };
  const data = await Branches.findOne(query);
  return data !== null;
}
