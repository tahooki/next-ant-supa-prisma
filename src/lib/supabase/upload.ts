import { createClient } from "@/lib/supabase/client";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

const supabase = createClient();

export async function upload(
  file: File,
  bucket: string,
  config?: AxiosRequestConfig
) {
  return new Promise(async (resolve, reject) => {
    const type = file.type;
    const name = file.name;
    const blob = new Blob([file], { type });
    const formData = new FormData();
    formData.append("cacheControl", "3600");
    formData.append("", blob);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    const timestamp = Date.now();

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${timestamp}-${name}`;

    console.log(url, formData);

    const headers = {
      "Content-Type": "multipart/form-data",
      // @ts-ignore
      ...supabase.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .post(url, formData, {
        headers: headers,
        onUploadProgress: config?.onUploadProgress,
        onDownloadProgress: config?.onDownloadProgress,
      })
      .then((res) => {
        resolve(url);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
