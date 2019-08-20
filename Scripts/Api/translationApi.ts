import axios from "axios";
import { baseUrl as baseURL } from "./constants";

const fetcher = axios.create({ baseURL });

function getTranslations(keys: string[], mappingLocation?, url = `/api/ReferenceData/GetTranslationsByKey`) {
  return fetcher.post(url, keys).then(({ data }) => {
    return data.reduce((result, { Key, Translation }) => {
      result[Key] = Translation;
      return result;
    }, {});
  });
}

export { getTranslations };
