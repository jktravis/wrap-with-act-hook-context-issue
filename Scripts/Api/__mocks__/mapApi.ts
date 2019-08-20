function addFacilityToIncident({ incidentId, FacilityGUID }) {
  return Promise.resolve([]);
}

function removeFacilityFromIncident({ incidentId, FacilityGUID }) {
  return Promise.resolve([]);
}

const getIncidentAsGeoJson = jest.fn(() => {
  return Promise.resolve({
    type: "FeatureCollection",
    features: [],
  });
});

function getBackgroundLayersAsFeatures() {
  return Promise.resolve([]);
}

function getIncidentServices(id) {
  return Promise.resolve([]);
}

function getWfsFeature() {
  return Promise.resolve([]);
}

function getAvailableWmfsServices(projectID) {
  return Promise.resolve([]);
}

function getLocatorData(id) {
  return Promise.resolve([]);
}

const addSketchToIncident = jest.fn(({ incidentId, ...data }) => Promise.resolve([]));

function removeSketchFromIncident(projectId, params) {
  return Promise.resolve([]);
}

const getXmlFromUrl = jest.fn(() => Promise.resolve(""));

const saveMapToolDataAsKml = jest.fn(() => Promise.resolve({}));

const getAvailableWMTS = jest.fn(() => Promise.resolve([]));

const getDefaultWMTS = jest.fn(() => Promise.resolve({}));

const getWmtsCapabilities = jest.fn(() => Promise.resolve({}));

const getIncidentFacilityFeatures = jest.fn(() => Promise.resolve([]));

const getLocatorDataWithHistory = jest.fn(() => Promise.resolve({}));

const getSingleLocatorDataWithHistory = jest.fn(() => Promise.resolve({}));

const addFacilitiesToIncident = jest.fn(() => Promise.resolve([]));

const removeFacilitiesFromIncident = jest.fn(() => Promise.resolve([]));

export {
  addFacilitiesToIncident,
  addFacilityToIncident,
  addSketchToIncident,
  getAvailableWMTS,
  getAvailableWmfsServices,
  getBackgroundLayersAsFeatures,
  getDefaultWMTS,
  getIncidentAsGeoJson,
  getIncidentFacilityFeatures,
  getIncidentServices,
  getLocatorData,
  getLocatorDataWithHistory,
  getWfsFeature,
  getWmtsCapabilities,
  getXmlFromUrl,
  removeFacilitiesFromIncident,
  removeFacilityFromIncident,
  removeSketchFromIncident,
  saveMapToolDataAsKml,
};
