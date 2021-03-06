import axios from "axios";
import { baseUrl } from "./constants";
import qs from "query-string";
import * as R from "ramda";

const getData = R.prop("data");

const fetcher = axios.create({
  baseURL: baseUrl,
});

interface SearchAllFacilitiesParams {
  query: string;
  orgListString?: string;
  isLoading?: boolean;
  wktString?: string;
  categoryGUID?: string;
  subCategoryGUID?: string;
  facilityTags?: string;
}

/**
 * Normalize the Id/PrimaryKey to be just one Id property.
 * @param catOrTag
 */
const getPrimaryKey = catOrTag => {
  if (catOrTag.FacilitySubCategoryGUID) {
    return catOrTag.FacilitySubCategoryGUID;
  } else if (catOrTag.FacilityTagGUID) {
    return catOrTag.FacilityTagGUID;
  }
  return catOrTag.FacilityCategoryGUID;
};

const normalizeCategoryAndTags = R.curry(catOrTag => {
  return R.compose(
    R.assoc("PrimaryKey", getPrimaryKey(catOrTag)),
    R.assoc("Name", R.prop("CurrentCultureTranslation", catOrTag)),
  )(catOrTag);
});

const normalizeAllCategoryAndTagsFromData = R.compose(
  R.map(normalizeCategoryAndTags),
  getData,
);

function searchAllFacilities(params: SearchAllFacilitiesParams): any {
  return fetcher.get(`/api/FacilityAPI/SearchAllFacilitiesDirect?${qs.stringify(params)}`).then(getData);
}

function getCategoriesForIncident(id) {
  return fetcher.get(`/api/FacilityAPI/GetCategories/${id}`).then(normalizeAllCategoryAndTagsFromData);
}

function getTagsForIncident(id) {
  return fetcher.get(`/api/FacilityAPI/GetTags/${id}`).then(normalizeAllCategoryAndTagsFromData);
}

function getSubCategoryForCategory(categoryId) {
  return fetcher
    .get(`/api/FacilityAPI/GetSubCategories?FacilityCategoryGUID=${categoryId}`)
    .then(normalizeAllCategoryAndTagsFromData);
}

export {
  searchAllFacilities,
  getCategoriesForIncident,
  getTagsForIncident,
  getSubCategoryForCategory,
};
