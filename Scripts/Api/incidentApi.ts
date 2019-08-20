import axios from "axios";
import { baseUrl } from "./constants";

const fetcher = axios.create({
  baseURL: baseUrl,
});

/// returns a list of incident types for the current user's org
function getIncidentTypes(): Promise<any[]> {
  return fetcher.get(`/api/IncidentAPI/GetProjectTypes`).then(({ data }) => data);
}

export { getIncidentTypes };
