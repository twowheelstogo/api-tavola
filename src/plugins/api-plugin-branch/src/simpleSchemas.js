import SimpleSchema from "simpl-schema";

export const Point = new SimpleSchema({
  "type": {
    type: String,
    allowedValues: "Point"
  },
  "coordinates": {
    type: Array
  },
  "coordinates.$": {
    type: Number
  }
});

export const Polygon = new SimpleSchema({
  "type": {
    type: String,
    allowedValues: "Polygon"
  },
  "coordinates": {
    type: Array
  },
  "coordinates.$": {
    type: Array
  },
  "coordinates.$.$": {
    type: Array
  },
  "coordinates.$.$.$": {
    type: Number
  }
});

export const GeneralDataBranch = new SimpleSchema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  invoiceCode: {
    type: String
  },
  deliveryCode: {
    type: String
  }
});

export const ScheduledDataBranch = new SimpleSchema({
  isClosed: {
    type: Boolean
  },
  sheduledOpenString: {
    type: String
  },
  scheduledOpenNumber: {
    type: Number
  },
  scheduledCloseString: {
    type: String
  },
  scheduledClosedNumber: {
    type: Number
  }
});

export const GeographyDataBranch = new SimpleSchema({
  point: {
    type: Point
  },
  polygon: {
    type: Polygon
  },
  distance: {
    type: Number
  }
});

export const Branch = new SimpleSchema({
  "generalData": GeneralDataBranch,
  "scheduleData": {
    type: Array
  },
  "scheduleData.$": {
    type: ScheduledDataBranch
  },
  "shopId": {
    type: String
  },
  "geographyData": GeographyDataBranch
});

export const DistanceAddressBranch = new SimpleSchema({
  text: {
    type: String
  },
  value: {
    type: Number
  },
  branchId: {
    type: String
  }
});

export const MetaddressBranch = new SimpleSchema({
  // eslint-disable-next-line camelcase
  administrative_area_level_1: {
    type: String
  },
  // eslint-disable-next-line camelcase
  administrative_area_level_2: {
    type: String
  },
  neighborhood: {
    type: String
  },
  // eslint-disable-next-line camelcase
  street_address: {
    type: String
  },
  sublocality: {
    type: String
  },
  distance: DistanceAddressBranch
});
