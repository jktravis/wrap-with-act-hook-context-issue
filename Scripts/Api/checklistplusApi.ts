import axios from "axios";
import { baseUrl } from "./constants";
import qs from "query-string";
import { error } from "xstate/lib/actions";

const fetcher = axios.create({
  baseURL: baseUrl,
});

function importChecklistFromFile(file) {
  return fetcher
    .post("/api/ChecklistPlusAPI/ImportChecklistFromFile", file, { responseType: "arraybuffer" })
    .then(({ data }) => data)
    .catch(({ error }) => error);
}

interface ChecklistPlusTemplate {
  checklistPlusTemplateGUID?: string;
  templateData: string;
  organizationName: string;
  templateTitle: string;
  templateDescription: string;
}
function createChecklistTemplate(params: ChecklistPlusTemplate) {
  return fetcher.post(`/api/ChecklistPlusAPI/CreateChecklistTemplate?`, params).then(({ data }) => data);
}
function updateChecklistTemplate(params: ChecklistPlusTemplate) {
  return fetcher.put(`/api/ChecklistPlusAPI/UpdateChecklistTemplate?`, params).then(({ data }) => data);
}

interface ChecklistPlusInstance {
  checklistInstanceData: any;
  checklistPlusTemplateGUID?: string;
  logEntryGUID?: string;
  instanceTitle?: string;
  instanceDescription?: string;
  organizationName: string;
  dateLastModified?: string;
}
function addChecklistEntry(params: ChecklistPlusInstance, id) {
  return fetcher.post(`/api/ChecklistPlusAPI/AddChecklistInstance?id=${id}`, params).then(({ data }) => data);
}

interface RemoveChecklistEntryArg {
  templateGUID: string;
  id: string;
}
function removeChecklistEntry(params: RemoveChecklistEntryArg) {
  return fetcher
    .delete(`/api/ChecklistPlusAPI/RemoveChecklistInstance?${qs.stringify(params)}`)
    .then(({ data }) => data);
}

//function updateChecklistEntry(params: ChecklistPlusInstance, id) {
//  return fetcher.put(`/api/ChecklistPlusAPI/UpdateChecklistInstance?id=${id}`, params).then(({ data }) => data);
//}

interface ProjGuidParam {
  id: string;
}
function GetChecklistInstanceList(params: ProjGuidParam) {
  return fetcher.get(`/api/ChecklistPlusAPI/GetChecklistInstanceList`, { params }).then(({ data }) => data);
}

interface OrgNameParam {
  OrganizationName: string;
}
function getChecklists(params: OrgNameParam) {
  return fetcher.get("/api/ChecklistPlusAPI/GetChecklistsByOrg", { params }).then(({ data }) => data);
}

interface AvailOrgNameParam {
  OrganizationName: string;
  IncidentProjGUID: string;
}
function getAvailableChecklists(params: AvailOrgNameParam) {
  return fetcher.get("/api/ChecklistPlusAPI/GetChecklistsByOrgAndProject", { params }).then(({ data }) => data);
}

interface GuidStrParam {
  SelectedGuidString: string;
}
function getChecklistByGUID(params: GuidStrParam) {
  return fetcher.get("/api/ChecklistPlusAPI/GetChecklistByGUID", { params }).then(({ data }) => data);
}

interface GetInstanceParams {
  id: string;
  templateGUID: string;
}
function getChecklistEntry(params: GetInstanceParams) {
  return fetcher.get("/api/ChecklistPlusAPI/GetChecklistInstance", { params }).then(({ data }) => data);
}

function removeChecklist(params: GuidStrParam) {
  return fetcher.delete("/api/ChecklistPlusAPI/RemoveChecklist", { params }).then(({ data }) => data);
}

export {
  importChecklistFromFile,
  createChecklistTemplate,
  getChecklists,
  getAvailableChecklists,
  getChecklistByGUID,
  updateChecklistTemplate,
  removeChecklist,
  addChecklistEntry,
  getChecklistEntry,
  GetChecklistInstanceList,
  removeChecklistEntry,
};
