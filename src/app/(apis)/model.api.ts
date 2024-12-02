import axios from "axios";

export const requestModel = async (model: string, params: any) => {
  return axios.get(`/api/${model}`, { params });
};
