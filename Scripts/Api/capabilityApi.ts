import axios from "axios";
import { baseUrl } from "./constants";
import { number } from "prop-types";

const fetcher = axios.create({
  baseURL: baseUrl,
});
export function getESFs() {
  return fetcher.get("/content/esf-reference.json").then(({ data }) => data);
}
export function getUnitsPerESF(esfId: number): Promise<any[]> {
  return fetcher.get(`/api/CapabilityAPI/GetUnitsByESFNumber?esfId=${esfId}`).then(({ data }) => data);
}
export function getUnitsPerCapability(GUID: number): Promise<any[]> {
  return fetcher.get(`/api/CapabilityAPI/GetUnitsByCapabilityGUID?CapGUID=${GUID}`).then(({ data }) => data);
}

export function getAllCapabilities(): Promise<any[]> {
  return fetcher.get("/api/CapabilityAPI/GetAllCapabilities").then(({ data }) => data);
}
