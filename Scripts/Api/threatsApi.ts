import axios from "axios";
import { baseUrl } from "./constants";
import { Moment } from "moment";

const fetcher = axios.create({
  baseURL: baseUrl,
});

function getSeverityLevels(): any[] {
  return [
    { name: "Unknown", value: 1 },
    { name: "Low", value: 2 },
    { name: "Medium", value: 3 },
    { name: "High", value: 4 },
    { name: "Significant", value: 5 },
  ];
}
function getThreatRegistrationMetaData(registrationId: string) {
  return fetcher
    .get(`/api/ThreatAPI/GetThreatRegistrationDTO?threatRegistrationGUID=${registrationId}`)
    .then(({ data }) => data);
}
function getThreatRegistrations(organizationName: string = "") {
  const url = `/api/ThreatAPI/GetRegistrationsForOrganization${
    organizationName !== "" ? "?organizationName=" + organizationName : ""
  }`;
  return fetcher.get(url).then(({ data }) => data);
}
function getThreatMetaData(threatId: string) {
  return fetcher.get(`/api/ThreatAPI/GetThreatDetails?threatGUID=${threatId}`).then(({ data }) => data);
}

function getImpactedFacilities(threatId: string): Promise<any> {
  return fetcher.get(`/api/ThreatAPI/GetImpactedFacilities?threatGUID=${threatId}`).then(({ data }) => data);
}
function getThreatGeometry(threatId: string): Promise<any> {
  return fetcher.get(`/api/ThreatAPI/GetThreatGeometry?threatGUID=${threatId}`).then(({ data }) => data);
}
function getAreasOfConcernGeometry(threatId: string): Promise<any> {
  return fetcher
    .get(`/api/ThreatAPI/GetThreatRegistrationAreasOfConcernAsGeoJSON?threatId=${threatId}`)
    .then(({ data }) => data);
}

function getThreatsForRegistration(registrationId: string, threatLevel: string, since: Moment): Promise<any> {
  return fetcher
    .get(
      `/api/ThreatAPI/GetThreatsBySeverity?severity=${threatLevel}&since=${since.format(
        "MM-DD-YYYY",
      )}&registrationGUID=${registrationId}`,
    )
    .then(({ data }) => data);
}

function createIncidentFromThreat(
  incidentName: string,
  incidentType: string,
  incidentStartDate: Moment,
  threat: any,
  impactedFacilities: any[],
  alertUsers: boolean,
): Promise<string> {
  const incidentRequest: any = {
    incidentName,
    incidentType,
    incidentStartDate,
    impactedFacilityGUIDs: impactedFacilities.map(f => f.FacilityGUID),
    threatGUID: threat.ThreatEntryGUID,
    alertUsers,
  };
  return fetcher.post(`/api/ThreatAPI/CreateIncidentFromThreat`, incidentRequest).then(({ data }) => data);
}

function getAvailableThreatWatchers(): Promise<any[]> {
  return fetcher.get("/api/ThreatAPI/GetAvailableThreats").then(({ data }) => data);
}

function addThreatRegistration(registration: any): Promise<boolean> {
  return fetcher.post("/api/ThreatAPI/RegisterForThreat", registration).then(({ data }) => data);
}

function adjudicateThreat(threatId: any): Promise<any> {
  return fetcher.post(`/api/ThreatAPI/AdjudicateThreat?threatGUID=${threatId}`);
}

function deleteThreatRegistration(registrationId: any): Promise<any> {
  return fetcher
    .post(`/api/ThreatAPI/deleteThreatRegistration?registrationGUID=${registrationId}`, {})
    .then(({ data }) => data);
}

export {
  getThreatRegistrationMetaData,
  getThreatMetaData,
  getThreatRegistrations,
  getImpactedFacilities,
  getThreatGeometry,
  getThreatsForRegistration,
  createIncidentFromThreat,
  getAreasOfConcernGeometry,
  getAvailableThreatWatchers,
  addThreatRegistration,
  adjudicateThreat,
  deleteThreatRegistration,
  getSeverityLevels,
};
