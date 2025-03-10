import { logError } from "@/lib/error-logging";
import axios, { AxiosResponse } from "axios";

export type RequestResponse<T = any> = AxiosResponse<T> & {
  abortController: AbortController;
};

export const request = async <T = any>(
  url: string,
  method: string,
  data: any
): Promise<RequestResponse<T>> => {
  const abortController = new AbortController();

  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case "GET":
        response = await axios.get<T>(`/api/${url}`, {
          params: data,
          signal: abortController.signal,
        });
        break;
      case "POST":
        response = await axios.post<T>(`/api/${url}`, data, {
          signal: abortController.signal,
        });
        break;
      case "PATCH":
        response = await axios.patch<T>(`/api/${url}`, data, {
          signal: abortController.signal,
        });
        break;
      case "DELETE":
        response = await axios.delete<T>(`/api/${url}`, {
          signal: abortController.signal,
        });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return { ...response, abortController };
  } catch (error: any) {
    // 에러 로깅
    await logError(error, {
      endpoint: url,
      method: method,
      requestData: data,
      statusCode: error.response?.status,
      severity: getSeverityLevel(error),
    });

    throw error; // 에러를 다시 throw하여 호출자가 처리할 수 있도록 함
  }
};

// 에러의 심각도를 판단하는 헬퍼 함수
function getSeverityLevel(error: any): "LOW" | "MEDIUM" | "HIGH" {
  if (!error.response) {
    return "HIGH"; // 네트워크 에러 등
  }

  const status = error.response.status;

  if (status >= 500) {
    return "HIGH"; // 서버 에러
  } else if (status >= 400) {
    return "MEDIUM"; // 클라이언트 에러
  } else {
    return "LOW"; // 기타 에러
  }
}
