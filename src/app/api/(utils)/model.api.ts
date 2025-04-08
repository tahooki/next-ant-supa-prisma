import initAxios from "@/app/init-axios";
import axios from "axios";
import type { RequestResponse } from "./utils";
import { request } from "./utils";

initAxios();

export const requestModel = async (model: string, params: any) => {
  return axios.get(`/api/${model}`, { params });
};

export const requestGet = async <T = any>(
  url: string,
  params: any
): Promise<RequestResponse<T>> => {
  return request<T>(url, "GET", params);
};

export const requestPost = async <T = any>(
  url: string,
  params: any
): Promise<RequestResponse<T>> => {
  return request<T>(url, "POST", params);
};

export const requestPatch = async <T = any>(
  url: string,
  params: any
): Promise<RequestResponse<T>> => {
  return request<T>(url, "PATCH", params);
};

export const requestDelete = async <T = any>(
  url: string,
  params?: any
): Promise<RequestResponse<T>> => {
  return request<T>(url, "DELETE", params);
};
