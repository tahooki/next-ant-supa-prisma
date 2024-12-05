import { base64StringToBlob } from "blob-util";
import dataURLtoBlob from "dataurl-to-blob";

export function getImageFile() {
  return new Promise((r) => {
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "file");
    inputElement.setAttribute("accept", "image/*");
    inputElement.addEventListener("change", async (event: any) => {
      const file = event.target.files[0];
      const newFile = await rotateCorrectOrientation(file);
      r(newFile);
    });
    inputElement.click();
  });
}

export function getPreviewImageFile(file: File) {
  return new Promise((r) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        r(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
}

export async function rotateCorrectOrientation(file: any): Promise<File> {
  return new Promise<File>(async (resolve, _) => {
    const fileType = file.type;
    console.log("fileType", fileType);

    if (fileType.includes("gif")) {
      resolve(file);
      return;
    }

    const image = new Image();

    image.addEventListener("load", async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      console.log("fileType", fileType);
      const dataURL = canvas.toDataURL(fileType);
      console.log("dataURL", dataURL);
      const blob = dataURLtoBlob(dataURL);
      const newFileName = "image." + fileType.split("/")[1];
      const newFile = new File([blob], newFileName, { type: fileType });
      resolve(newFile);
    });

    image.src = URL.createObjectURL(file);
  });
}

export const base64ToImageFile = (
  dataUrl: string,
  type: string,
  filename?: string
) => {
  const blobString = base64StringToBlob(
    dataUrl.replace(/^data:image\/\w+;base64,/, ""),
    type
  );
  filename = filename
    ? filename
    : [
        Math.floor(Math.random() * 1e12),
        "-",
        new Date().getTime(),
        ".",
        // @ts-ignore
        type.match(/^image\/(\w+)$/i)[1],
      ].join("");

  const file = new File([blobString], filename, { type });
};
