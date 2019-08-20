import axios, { AxiosInstance } from "axios";
import { baseUrl } from "./constants";

const fetcher: AxiosInstance = axios.create({
  baseURL: baseUrl,
});

function searchAllUsers(searchText: string): Promise<any[]> {
  return fetcher.get(`/api/UserAPI/SearchByText?searchText=${searchText}`).then(({ data }) => data);
}

export { searchAllUsers };
