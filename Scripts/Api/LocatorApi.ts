import axios from "axios";
import { baseUrl } from "./constants";

const fetcher = axios.create({
  baseURL: baseUrl,
});

interface OrgNameParam {
  OrganizationName: string;
}

interface ProjectGuidParam {
  id: string;
}

interface SerialNumParam {
  serialNum: string;
}

function getListOfLocators(params: OrgNameParam) {
  return fetcher.get("/api/LocatorAPI/GetLocatorsByOrg", { params }).then(({ data }) => data);
}

function getLocatorBySerial(params: SerialNumParam) {
  return fetcher.get("/api/LocatorAPI/GetLocatorBySerial", { params }).then(({ data }) => data);
}

function getListOfActiveLocatorsForProject(params: ProjectGuidParam) {
  return fetcher.get("/api/LocatorAPI/GetActiveLocatorsForProject", { params }).then(({ data }) => data);
}

function getListOfLocatorTypes(params: OrgNameParam) {
  return fetcher.get("/api/LocatorAPI/GetLocatorTypesByOrg", { params }).then(({ data }) => data);
}

function getListOfLocatorReadings(serialNum) {
  return fetcher
    .get("/api/LocatorAPI/GetPayloadByLocatorSerial", { params: { serial: serialNum } })
    .then(({ data }) => data);
}

function getListOfLocatorReadingsByDateRange(serialNum, start, end) {
  return fetcher
    .get("/api/LocatorAPI/GetPayloadByLocatorSerialForDateRange", {
      params: { serial: serialNum, unixStartTime: start, unixEndTime: end },
    })
    .then(({ data }) => data);
}

function getListOfActiveLocatorReadingsForIncident(params: ProjectGuidParam) {
  return fetcher.get("/api/LocatorAPI/GetPayloadsForActiveLocatorsByIncident", { params }).then(({ data }) => data);
}

function getListOfLocatorTypesImages(params: OrgNameParam) {
  return fetcher.get("/api/RiskAPI/GetRiskImagePoolListByOrg", { params }).then(({ data }) => data);
}

function getListOfLocatorGroupsForIncident(params: ProjectGuidParam) {
  return fetcher.get("/api/LocatorAPI/GetLocatorGroupsForProject", { params }).then(({ data }) => data);
}

function addLocatorTypeImage(files, params: OrgNameParam) {
  return fetcher.post("/api/LocatorAPI/CreateLocatorTypeImagePool", files, { params }).then(({ data }) => data);
}

function createLocatorType(typeName, orgName, locTypeImageGuid) {
  return fetcher
    .post(
      "/api/LocatorAPI/CreateLocatorType?typeName=" +
        typeName +
        "&OrganizationName=" +
        orgName +
        "&locTypeImageGuid=" +
        locTypeImageGuid,
    )
    .then(({ data }) => data);
}

function createLocator(orgName, serialNum, locatorName, locatorTypeGuid) {
  return fetcher
    .post(
      "/api/LocatorAPI/RegisterLocator?OrganizationName=" +
        orgName +
        "&serialNum=" +
        serialNum +
        "&locatorName=" +
        locatorName +
        "&locatorTypeGuid=" +
        locatorTypeGuid,
    )
    .then(data => data, error => error);
}

function createLocatorGroupForIncident(project, name, selectedSerials) {
  return fetcher
    .post("/api/LocatorAPI/CreateLocatorGroupForProject?id=" + project + "&groupName=" + name, selectedSerials)
    .then(({ data }) => data);
}

function addActiveLocatorToProject(serialNumber, projectGUID) {
  return fetcher
    .post("/api/LocatorAPI/AddActiveLocatorToProject?serialNumber=" + serialNumber + "&id=" + projectGUID)
    .then(({ data }) => data);
}

function UpdateLocator(id, locatorName, orgName, locatorTypeGuid) {
  return fetcher
    .post(
      "/api/LocatorAPI/UpdateLocator?locatorID=" +
        id +
        "&locatorName=" +
        locatorName +
        "&OrganizationName=" +
        orgName +
        "&locatorTypeGuid=" +
        locatorTypeGuid,
    )
    .then(({ data }) => data);
}

function UpdateActiveLocatorDateRange(projectGuid, serialNumber, startTime, endTime) {
  return fetcher
    .post(
      "/api/LocatorAPI/UpdateActiveLocatorReadingRange?id=" +
        projectGuid +
        "&serialNumber=" +
        serialNumber +
        "&unixStartTime=" +
        startTime +
        "&unixEndTime=" +
        endTime,
    )
    .then(({ data }) => data);
}

function updateLocatorGroupForIncident(id, oldGroupName, newGroupName, selectedSerials) {
  return fetcher
    .post(
      "/api/LocatorAPI/UpdateLocatorGroupForProject?id=" +
        id +
        "&oldGroupName=" +
        oldGroupName +
        "&newGroupName=" +
        newGroupName,
      selectedSerials,
    )
    .then(({ data }) => data);
}

function removeLocator(serialNum) {
  return fetcher.delete("/api/LocatorAPI/DeleteLocator?serialNum=" + serialNum).then(({ data }) => data);
}

function removeLocatorGroupFromIncident(projectGuid, teamName) {
  return fetcher
    .delete("/api/LocatorAPI/DeleteLocatorGroupFromProject?id=" + projectGuid + "&groupName=" + teamName)
    .then(({ data }) => data);
}

function removeActiveLocatorFromProject(serialNumber, projectGuid) {
  return fetcher
    .delete("/api/LocatorAPI/RemoveActiveLocatorFromProject?serialNumber=" + serialNumber + "&id=" + projectGuid)
    .then(({ data }) => data);
}

function removeLocatorType(locTypeGuid) {
  return fetcher.delete("/api/LocatorAPI/DeleteLocatorType?locTypeGuid=" + locTypeGuid).then(({ data }) => data);
}

function removeLocatorTypeImage(locTypeImageGuid) {
  return fetcher
    .delete("/api/LocatorAPI/DeleteLocatorTypeImagePool?locatorTypeImagePoolGUID=" + locTypeImageGuid)
    .then(({ data }) => data);
}

function massImportLocatorsFromFile(file) {
  return fetcher
    .post("/api/LocatorAPI/ImportLocatorsFromFile", file, { responseType: "arraybuffer" })
    .then(({ data }) => data);
}

function UpdateLocatorType(locTypeGuid, typeName, locTypeImageGuid) {
  return fetcher
    .post(
      "/api/LocatorAPI/UpdateLocatorType?locTypeGuid=" +
        locTypeGuid +
        "&typeName=" +
        typeName +
        "&locTypeImageGuid=" +
        locTypeImageGuid,
    )
    .then(({ data }) => data);
}

function getLocatorGeoJSONIncludingHistoryForIncident(projectGUID: string): Promise<any> {
  return fetcher.get(`/api/MapAPI/ExportLocatorDataAsFeaturesIncludingHistory/${projectGUID}`).then(({ data }) => data);
}
function getSingleLocatorGeoJSONIncludingHistoryForIncident(projectGUID: string, serialNumber: string): Promise<any> {
  return fetcher
    .get(
      `/api/MapAPI/ExportSingleLocatorDataAsFeaturesIncludingHistory/${projectGUID}?locatorSerialNumber=${serialNumber}`,
    )
    .then(({ data }) => data);
}

// fetches the latest reading, finding last location information if it doesn't exist for the reading
function getGetLocatorReading(readingId: number, serialNumber: string): Promise<any> {
  return fetcher
    .get(`/api/LocatorAPI/GetLocatorReadingWithLastGoodLocation?readingId=${readingId}&serialNumber=${serialNumber}`)
    .then(({ data }) => data);
}
// // fetches the latest locator entry for displaying in the admin screen (including battery level)
// function getAdminLocatorEntry(serialNumber: string): Promise<any> {
//   return fetcher.get(`/api/LocatorAPI/GetLocatorAdminEntry?serialNumber=${serialNumber}`).then(({ data }) => data);
// }

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
