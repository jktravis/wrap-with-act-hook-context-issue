import axios from "axios";
import { baseUrl } from "Api/constants";

const fetcher = axios.create({
  baseURL: baseUrl,
});

function getAvailableSymbols(id) {
  return fetcher(`/Tools/MainMap/GetSymbolDataAsJson/${id}`).then(({ data }) => data);
}

export { getAvailableSymbols };
