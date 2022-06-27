import fetch from "node-fetch";

const API_GOOGLE_MAPS = "https://maps.googleapis.com/maps/api";
const STREETS = [
  "administrative_area_level_1",
  "administrative_area_level_2",
  "neighborhood",
  "street_address",
  "sublocality"
];
const serviceGeoCode = async (point) => {
  const googleMapsKey = process.env.GOOOGLE_MAPS_KEY;
  let url = API_GOOGLE_MAPS;
  url += "/geocode/json";
  // eslint-disable-next-line function-paren-newline
  url += `?latlng=${encodeURIComponent(
    `${point.coordinates[1]},${point.coordinates[0]}`
    // eslint-disable-next-line function-paren-newline
  )}`;
  url += `&language=${encodeURIComponent("es")}`;
  url += `&region=${encodeURIComponent("gt")}`;
  url += `&key=${encodeURIComponent(googleMapsKey)}`;

  const res = await fetch(url, {
    method: "GET"
  });
  if (!res.ok) {
    throw new Error("Error en la comunicación con Google maps");
  }
  const data = await res.json();
  const _streets = {};
  const setAddress = new Set(STREETS);
  if (data.status === "OK") {
    if (data.results) {
      for (let i = 0; i < data.results.length && setAddress.size > 0; i++) {
        data.results[i].address_components.forEach((add) => {
          const interceptions = add.types.filter((type) =>
            setAddress.has(type)
          );
          if (interceptions.length > 0) {
            const addressFind = interceptions[0];
            setAddress.delete(addressFind);
            _streets[addressFind] = add.long_name;
          }
        });
      }
    }
  }
  setAddress.forEach((val) => {
    _streets[val] = "";
  });
  return _streets;
};

const serviceDistanceMatrix = async (origin, destination) => {
  const googleMapsKey = process.env.GOOOGLE_MAPS_KEY;
  let url = API_GOOGLE_MAPS;
  url += "/distancematrix/json";
  // eslint-disable-next-line function-paren-newline
  url += `?origins=${encodeURIComponent(
    `${origin.coordinates[1]},${origin.coordinates[0]}`
    // eslint-disable-next-line function-paren-newline
  )}`;
  // eslint-disable-next-line function-paren-newline
  url += `&destinations=${encodeURIComponent(
    `${destination.coordinates[1]},${destination.coordinates[0]}`
    // eslint-disable-next-line function-paren-newline
  )}`;
  url += `&language=${encodeURIComponent("es")}`;
  url += `&region=${encodeURIComponent("gt")}`;
  url += `&key=${encodeURIComponent(googleMapsKey)}`;
  const res = await fetch(url, {
    method: "GET"
  });
  if (!res.ok) {
    throw new Error("Error en la comunicación con Google maps");
  }
  const data = await res.json();
  if (data.status === "OK") {
    if (data.rows) {
      if (data.rows[0]) {
        if (data.rows[0].elements) {
          if (data.rows[0].elements[0]) {
            if (data.rows[0].elements[0].distance) {
              data.rows[0].elements[0].distance.value /= 1000;
              return data.rows[0].elements[0].distance;
            }
          }
        }
      }
    }
  }
  return {
    distance: {
      text: "",
      value: 0,
      branchId: ""
    }
  };
};

export default {
  serviceDistanceMatrix,
  serviceGeoCode
};
