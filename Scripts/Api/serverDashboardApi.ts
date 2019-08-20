import axios from "axios";
import { baseUrl as baseURL } from "./constants";

const fetcher = axios.create({ baseURL });

function GetServerDashboardList() {
  return fetcher.get(`api/ServerDashboardApi/GetServerDashboardEntries`).then(({ data }) => data);
}
interface ServerDashParam {
  serverDashboardLoginInfoGUID: string;
}
function GetServerDetails(params: ServerDashParam) {
  return fetcher.get(`api/ServerDashboardApi/GetServerData`, { params }).then(({ data }) => data);
}

function RemoveServerEntry(params: ServerDashParam) {
  return fetcher.delete(`api/ServerDashboardApi/ServerEntry`, { params }).then(({ data }) => data);
}

interface AddServerParams {
  servername: string;
  username: string;
  password: string;
}
function AddServerEntry(params: AddServerParams) {
  return fetcher.post(`api/ServerDashboardAPI/ServerEntry`, params).then(({ data }) => data);
}

export { GetServerDashboardList, GetServerDetails, RemoveServerEntry, AddServerEntry };
