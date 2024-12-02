import initAxios from "@/app/init-axios";
import axios from "axios";

initAxios();

export const requestModel = async (model: string, params: any) => {
  return axios.get(`/api/${model}`, { params });
};
