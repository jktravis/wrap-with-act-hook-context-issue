const searchAllFacilities = jest.fn(() => Promise.resolve([]));

const getCategoriesForIncident = jest.fn(() => Promise.resolve([]));

const getTagsForIncident = jest.fn(() => Promise.resolve([]));

const getSubCategoryForCategory = jest.fn(() => Promise.resolve([]));

export { searchAllFacilities, getCategoriesForIncident, getTagsForIncident, getSubCategoryForCategory };
