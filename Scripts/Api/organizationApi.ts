import axios from "axios";
import { baseUrl } from "./constants";

const fetcher = axios.create({
  baseURL: baseUrl,
});

function getListOfPossibleOrganizations() {
  return fetcher("/api/OrganizationAPI/ListPossibleOrganizationNames").then(({ data }) => data);
}

export { getListOfPossibleOrganizations };
