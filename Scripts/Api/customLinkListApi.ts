import axios from "axios";
import { baseUrl } from "./constants";

const fetcher = axios.create({
  baseURL: baseUrl,
});

function setUserLinks(links) {
  return fetcher.post(`/api/UserAPI/SetUserLinks/?`, links).then(({ data }) => data);
}
function getUserLinks() {
  return fetcher.get(`/api/UserAPI/GetUserLinks`).then(({ data }) => data);
}

export { setUserLinks, getUserLinks };
