import { RcFile } from "antd/es/upload";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHtmlToText(value: string) {
  value = value.replace(/<[^>]+>/g, "");
  value = value.replace(/&nbsp;/gi, "");
  return value;
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const titleCase = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const convertStringInUrlATag = (text: string) => {
  return text.replace(
    /((https?:\/\/|www\.)[^\s]+)/g,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
};

export const convertContent = (value?: string) => {
  if (!value) return "";

  const imgRegex = /<img[^>]+height="[^"]+"[^>]*>/g;
  const imgReplace = value?.match(imgRegex);
  if (imgReplace) {
    imgReplace.forEach((img) => {
      value = value?.replace(img, img.replace(/height="[^"]+"/g, ""));
    });
  }
  return value;
};
