import axios from "axios";
import * as R from "ramda";
import { baseUrl } from "./constants";
import qs from "query-string";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { optionsFromCapabilities } from "ol/source/WMTS";

const getData = R.prop("data");

const fetcher = axios.create({
  baseURL: baseUrl,
});

interface HasPrimaryKey {
  PrimaryKey: string;
}

interface HasInformationType {
  InformationType: string;
}

export interface HasPrimaryKeyAndInformationType extends HasPrimaryKey, HasInformationType {}

const addFacilitiesToIncident = R.curry((incidentId, queries: HasPrimaryKeyAndInformationType[]) => {
  return fetcher.post(`/api/mapApi/AddFacilitiesToIncident/${incidentId}`, queries).then(getData);
});

const removeFacilitiesFromIncident = R.curry((incidentId, data: HasPrimaryKeyAndInformationType[]) => {
  return fetcher.delete(`/api/mapApi/RemoveFacilitiesFromIncident/${incidentId}`, { data }).then(getData);
});

export {
  addFacilitiesToIncident,
  removeFacilitiesFromIncident,
};
