import axios from "axios";
import * as R from "ramda";
import { baseUrl } from "./constants";
import qs from "query-string";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { DrawTypes } from "Controllers/Tools/Map/Components/MapDrawingTools/drawingFsm";

const getData = R.prop("data");

const fetcher = axios.create({
  baseURL: baseUrl,
});

function getAvailableWMTS() {
  return fetcher.get("/api/MapAPI/GetAvailableWMTS").then(({ data }) => data);
}

function getDefaultWMTS() {
  return fetcher.get("/api/MapAPI/GetDefaultWMTS").then(({ data }) => data);
}

enum MapSourceType {
  GoogleRoads = 1,
  GoogleHybrid = 2,
  GoogleSatellite = 3,
  OSM = 4,
  NGI = 5,
}

enum MapConfigType {
  WMTS = 0,
  TileImage = 1,
  OSM = 2,
}

interface WmtsConfigOption {
  Name: string;
  Value: MapSourceType;
  MapType: MapConfigType;
  url: string;
  projection: string;
  crossOrigin: string;
  layer: string;
}

/**
 * @param config
 * @return {Promise}
 */
function getWmtsCapabilities(config: WmtsConfigOption) {
  return axios.get(config.url, { responseType: "text" }).then(({ data }) => {
    const result = new WMTSCapabilities().read(data);
    const opts = optionsFromCapabilities(result, {
      layer: config.layer,
      crossOrigin: config.crossOrigin,
      projection: config.projection,
    });
    return {
      ...config,
      layer: opts,
    };
  });
}

function getExistingSymbology() {
  return fetcher.get("/api/MapAPI/GetExistingSymbologies").then(({ data }) => data);
}

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

const addFacilityToIncident = R.curry((incidentId, query: HasPrimaryKeyAndInformationType) => {
  return fetcher
    .post(
      `/api/mapApi/AddFacilityToIncident/${incidentId}?primaryKey=${query.PrimaryKey}&informationType=${
        query.InformationType
      }`,
    )
    .then(getData);
});

const removeFacilitiesFromIncident = R.curry((incidentId, data: HasPrimaryKeyAndInformationType[]) => {
  return fetcher.delete(`/api/mapApi/RemoveFacilitiesFromIncident/${incidentId}`, { data }).then(getData);
});

const removeFacilityFromIncident = R.curry((incidentId, data) => {
  return fetcher.post(`/api/mapApi/RemoveFacilityFromIncident/${incidentId}`, data).then(getData);
});

function addBackgroundLayerToIncident({ incidentId, BackgroundLayerGUID }) {
  return fetcher
    .post(`/api/mapApi/AddBackgroundLayerToIncident/${incidentId}?BackgroundLayerGUID=${BackgroundLayerGUID}`)
    .then(({ data }) => data);
}

function removeBackgroundLayersFromIncident({ incidentId, BackgroundLayerGUID }) {
  return fetcher
    .post(`/api/mapApi/RemoveBackgroundLayerFromIncident/${incidentId}?BackgroundLayerGUID=${BackgroundLayerGUID}`)
    .then(({ data }) => data);
}

function getAvailableBackgroundLayers() {
  return fetcher.get(`/Tools/MainMap/GetAvailableBackgroundLayers`).then(({ data }) => data);
}

function getIncidentAsGeoJson(id) {
  return fetcher.get(`/api/mapapi/ExportIncidentAsGeoJSON/${id}`).then(({ data }) => data);
}

function getIncidentFacilityFeatures(id) {
  return fetcher.get(`/api/mapapi/ExportIncidentFacilityFeatures/${id}`).then(({ data }) => data);
}

function getBackgroundLayersAsFeatures(id) {
  return fetcher.get(`/api/mapApi/ExportIncidentBackgroundLayersAsFeatures/${id}`).then(({ data }) => data);
}

function getIncidentServices(id) {
  return fetcher.get(`/api/mapapi/GetIncidentServices/${id}`).then(({ data }) => data);
}

function getWfsFeature(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "text/plain;charset=UTF=8",
        },
      })
      .then(({ data }) => {
        /**
         * Some resources send back a 200 response with a body that contains an XML error message instead of
         * a proper 4xx or 5xx response code.
         * This addresses helps to address that issue.
         */
        if (typeof data === "string") {
          try {
            const xml = new DOMParser().parseFromString(data, "text/xml");
            // @ts-ignore
            const nsResolver = xml.createNSResolver(
              R.pathOr(xml.documentElement, ["ownerDocument", "documentElement"], xml),
            );
            const xPathResult = xml.evaluate("//ows:ExceptionText", xml, nsResolver, XPathResult.STRING_TYPE, null);

            return reject(`"Error fetching WFS feature. "${xPathResult.stringValue}`);
          } catch (error) {
            return reject("Error fetching WFS feature.");
          }
        }
        resolve(data);
      });
  });
}

/**
 * Dual-purpose fetcher for both WMS and WFS available services.
 * @param projectID
 */
function getAvailableWmfsServices(projectID) {
  return fetcher.get(`/Tools/MainMap/GetAvailableServices`, { params: { projectID } }).then(({ data }) => data);
}

function addServiceToIncident(incidentId, layerSelection) {
  return fetcher.post(`/api/mapapi/AddServiceToIncident/${incidentId}`, layerSelection).then(({ data }) => data);
}

function removeServiceFromIncident(incidentId, WMSLayerGUID) {
  return fetcher.post(`/api/mapapi/RemoveServiceFromIncident/${incidentId}`, undefined, {
    params: {
      WMSLayerGUID,
    },
  });
}

function getLocatorData(id) {
  return fetcher.get(`/api/mapapi/ExportLocatorDataAsFeatures/${id}`).then(({ data }) => data);
}

function getLocatorDataWithHistory(id) {
  return fetcher.get(`/api/mapapi/ExportLocatorDataAsFeaturesIncludingHistory/${id}`).then(({ data }) => data);
}

function getSingleLocatorDataWithHistory(id, serialNumber) {
  return fetcher
    .get(`/api/mapapi/ExportSingleLocatorDataAsFeaturesIncludingHistory/${id}?locatorSerialNumber=${serialNumber}`)
    .then(({ data }) => data);
}

interface GetCurrentLocationOptions {
  maximumAge?: number;
  timeout?: number;
  enableHighAccuracy?: boolean;
}

/**
 * Promise-wrapper for get the position via the native geolocation API
 * @link {https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition}
 * @param {GetCurrentLocationOptions} options
 */
function getCurrentLocation(options?: GetCurrentLocationOptions) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

interface AddSketchToIncidentArgs {
  incidentId: string;
  StrokeColor: string;
  FillColor: string;
  IconUrl: string;
  StrokeWidth: number;
  SketchName: string;
  SketchDescription: string;
  WKT: string;
  SymbolGUID: string;
  LogEntryGUID?: string;
  DrawType: number;
  MeasurementInfo?: {
    value: string | number;
    unit: string;
  };
}

function addSketchToIncident({ incidentId, ...data }: AddSketchToIncidentArgs) {
  return fetcher.post(`/api/mapapi/AddSketchToIncident/${incidentId}`, data);
}

interface KmlStyle {
  lineColor: string;
  lineWidth: number;
  lineOpacity: number;
  fillColor: string;
  /**
   * Casing is part of the API :(
   */
  FillOpacity: number;
}

interface HazardCircleSaveData {
  radius: number;
  units: number;
  MiscData: number;
  WKTGeom: string;
  style: KmlStyle;
}

interface SaveMapToolData {
  toolName: string;
  name: string;
  id?: string;
  latitude: number;
  longitude: number;
  description?: string;
  hazardCircles: HazardCircleSaveData[];
}
interface SaveMapToolDataAsKmlArgs {
  data: SaveMapToolData;
  incidentId: string;
  drawType: DrawTypes;
}

/**
 * @deprecated Use `addSketchToIncident` when possible
 */
function saveMapToolDataAsKml({ incidentId, data, drawType }: SaveMapToolDataAsKmlArgs) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    const validationTokenName = "__RequestVerificationToken";

    const token = Array.from(document.getElementsByTagName("input")).reduce((result, curr) => {
      if (curr.type === "hidden" && curr.name.includes(validationTokenName)) {
        return curr.value;
      }
      return result;
    }, "");

    formData.append("dataStr", JSON.stringify(data));
    formData.append("drawType", drawType.toString());
    formData.append(validationTokenName, token);

    return fetcher
      .post(`/Tools/MainMap/SaveMapToolData/${incidentId}`, formData, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      })
      .then(({ data }) => {
        /**
         * This endpoint doesn't use proper HTTP status codes. So we handle rejections
         * manually.
         */
        if (data.success) {
          resolve(data);
        }
        reject(data);
      });
  });
}

interface RemoveSketchFromIncidentParams {
  toolName: string;
  LogEntryGUID: string;
}

function removeSketchFromIncident(projectId, params: RemoveSketchFromIncidentParams) {
  return fetcher.post(`/api/mapapi/RemoveSketchFromIncident/${projectId}?${qs.stringify(params)}`);
}

interface GetGeoCodeFromGoogle {
  address: string;
  key: string;
}
function getGeoCodeFromGoogle(params: GetGeoCodeFromGoogle) {
  return axios.get("https://maps.googleapis.com/maps/api/geocode/json", { params }).then(({ data }) => data);
}

/**
 * Gets XML data from URL. Primarily used for KML.
 * @param url
 */
function getXmlFromUrl(url) {
  return axios
    .get(url, {
      responseType: "document",
    })
    .then(({ data }) => data);
}

export {
  addBackgroundLayerToIncident,
  addFacilitiesToIncident,
  addFacilityToIncident,
  addServiceToIncident,
  addSketchToIncident,
  getAvailableBackgroundLayers,
  getAvailableWMTS,
  getAvailableWmfsServices,
  getBackgroundLayersAsFeatures,
  getCurrentLocation,
  getDefaultWMTS,
  getExistingSymbology,
  getGeoCodeFromGoogle,
  getIncidentAsGeoJson,
  getIncidentFacilityFeatures,
  getIncidentServices,
  getLocatorData,
  getLocatorDataWithHistory,
  getSingleLocatorDataWithHistory,
  getWfsFeature,
  getWmtsCapabilities,
  getXmlFromUrl,
  removeBackgroundLayersFromIncident,
  removeFacilitiesFromIncident,
  removeFacilityFromIncident,
  removeServiceFromIncident,
  removeSketchFromIncident,
  saveMapToolDataAsKml,
};
