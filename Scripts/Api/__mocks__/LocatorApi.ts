const getListOfLocators = jest.fn(() => Promise.resolve([]));

const getLocatorBySerial = jest.fn(() => Promise.resolve([]));

const getListOfActiveLocatorsForProject = jest.fn(() => Promise.resolve([]));

const getListOfLocatorTypes = jest.fn(() => Promise.resolve([]));

const getListOfLocatorReadings = jest.fn(() => Promise.resolve([]));

const getListOfLocatorReadingsByDateRange = jest.fn(() => Promise.resolve([]));

const getListOfActiveLocatorReadingsForIncident = jest.fn(() => Promise.resolve([]));

const getListOfLocatorTypesImages = jest.fn(() => Promise.resolve([]));

const getListOfLocatorGroupsForIncident = jest.fn(() => Promise.resolve([]));

const addLocatorTypeImage = jest.fn(() => Promise.resolve([]));

const createLocatorType = jest.fn(() => Promise.resolve([]));

const createLocator = jest.fn(() => Promise.resolve([]));

const createLocatorGroupForIncident = jest.fn(() => Promise.resolve([]));

const addActiveLocatorToProject = jest.fn(() => Promise.resolve([]));

const UpdateLocator = jest.fn(() => Promise.resolve([]));

const UpdateActiveLocatorDateRange = jest.fn(() => Promise.resolve([]));

const updateLocatorGroupForIncident = jest.fn(() => Promise.resolve([]));

const removeLocator = jest.fn(() => Promise.resolve([]));

const removeLocatorGroupFromIncident = jest.fn(() => Promise.resolve([]));

const removeActiveLocatorFromProject = jest.fn(() => Promise.resolve([]));

const removeLocatorType = jest.fn(() => Promise.resolve([]));

const removeLocatorTypeImage = jest.fn(() => Promise.resolve([]));

const massImportLocatorsFromFile = jest.fn(() => Promise.resolve([]));

const UpdateLocatorType = jest.fn(() => Promise.resolve([]));

const getLocatorGeoJSONIncludingHistoryForIncident = jest.fn(() => Promise.resolve([]));

const getSingleLocatorGeoJSONIncludingHistoryForIncident = jest.fn(() => Promise.resolve([]));

const getGetLocatorReading = jest.fn(() => Promise.resolve([]));

export {
  getListOfLocators,
  createLocatorType,
  getListOfLocatorTypes,
  createLocator,
  removeLocator,
  removeLocatorType,
  massImportLocatorsFromFile,
  UpdateLocatorType,
  UpdateLocator,
  addLocatorTypeImage,
  getListOfLocatorTypesImages,
  removeLocatorTypeImage,
  removeActiveLocatorFromProject,
  getListOfActiveLocatorsForProject,
  addActiveLocatorToProject,
  getListOfLocatorReadings,
  getListOfActiveLocatorReadingsForIncident,
  UpdateActiveLocatorDateRange,
  getListOfLocatorReadingsByDateRange,
  removeLocatorGroupFromIncident,
  createLocatorGroupForIncident,
  getListOfLocatorGroupsForIncident,
  getLocatorBySerial,
  updateLocatorGroupForIncident,
  getLocatorGeoJSONIncludingHistoryForIncident,
  getSingleLocatorGeoJSONIncludingHistoryForIncident,
  getGetLocatorReading,
};
