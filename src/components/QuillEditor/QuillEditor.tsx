import { getImageFile, rotateCorrectOrientation, uploadImage } from "@/utils/image.util";
import Quill from "quill";
import { useQuill } from "react-quilljs";

import ImageDropAndPaste from "quill-image-drop-and-paste";
import ImageResize from "quill-image-resize";
import VideoResize from "quill-video-resize-module2";


type Props = {
  updateKey?: string;
  updateId?: any;
  width?: string;
  height?: string;
  value?: string;
  onChange?: (text: string) => void;
  onUploadImage: (image: any) => void;
};
// //


Quill.register("modules/VideoResize", VideoResize);
const font: any = Quill.import("formats/font");
font.whitelist = ["제목1", "제목2", "제목3", "본문1", "본문2", "본문3"];
Quill.register(font, true);
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDropAndPaste", ImageDropAndPaste);
var Block: any = Quill.import("blots/block");
Block.tagName = "DIV";
Quill.register(Block, true);

import { useEffect } from "react";

export default function QuillEditor({
  updateId,
  updateKey,
  width,
  height,
  value,
  onChange,
  onUploadImage,
}: Props) {
  const { quill, quillRef, Quill }: any = useQuill({
    modules: {
      VideoResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
      toolbar: {
        container: [
          "bold",
          "italic",
          "underline",
          { align: "" },
          { align: "center" },
          { align: "right" },
          { color: [] },
          { background: [] },
          "image",
          "video",
        ],
        handlers: {},
      },
      // https://www.npmjs.com/package/quill-image-resize
      imageResize: {
        modules: ["Resize"],
        handleStyles: {
          backgroundColor: "black",
          border: "none",
          color: "white",
          // other camelCase styles for size display
        },
      },

      // https://www.npmjs.com/package/quill-image-drop-and-paste
      imageDropAndPaste: {},
    },
  });

  // const uploadImage = async (file: File) => {
  //   const formData = new FormData();
  //   console.log("updateKey", updateKey);
  //   console.log("updateId", updateId);
  //   if (updateKey && updateId) {
  //     formData.append(updateKey, updateId);
  //   }
  //   formData.append("image", file);
  //   console.log(
  //     "`${process.env.NEXT_PUBLIC_API_URL}${uploadUrl}`",
  //     `${process.env.NEXT_PUBLIC_API_URL}${uploadUrl}`
  //   );
  //   const response = await axios.post(
  //     `${process.env.NEXT_PUBLIC_API_URL}${uploadUrl}`,
  //     formData
  //   );

  //   const data = await response.data;
  //   console.log(data);
  //   // 업로드한 이미지
  //   return data;
  // };

  // 업로드한 이미지를 나열한다. afterUpdateList

  useEffect(() => {
    if (quill) {
      quill.getModule("toolbar").addHandler("image", async () => {
        const file = await getImageFile();
        const newFile = await rotateCorrectOrientation(file);
        const image = await uploadImage(newFile);
        onUploadImage(image);

        const index =
          (quill.getSelection() || {}).index || quill.getLength() || 0;

        const url = image.url;
        if (url != null) {
          quill.insertEmbed(index, "image", url, "user");
        }
      });
      quill
        ?.getModule("toolbar")
        .addHandler("imageDropAndPaste", async () => {});
      quill?.getModule("toolbar").addHandler("video", async () => {
        let url: any = prompt("Enter Video URL: ");
        url = getVideoUrl(url);
        const index = (quill.getSelection() || {}).index || quill.getLength();
        if (url != null) {
          quill.insertEmbed(index, "video", url);
        }
      });
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      if (value) {
        quill.root.innerHTML = value;
      }

      if (onChange!) {
        quill.on("text-change", (
          delta: any,
          oldDelta: any,
          source: 'user' | 'api' | 'silent'
        ) => {
          onChange(quill.root.innerHTML);
        });
      }
    }
  }, [quill]);

  return (
    <>
      <div>
        <div ref={quillRef} />
      </div>
    </>
  );
}

// const QuillEditorContainer = styled.div<{ width: string; height: string }>`
//   width: ${(props) => props.width};
//   height: ${(props) => props.height};
//   padding-bottom: 42px;
// `;

function getVideoUrl(url: string) {
  let match =
    url.match(
      /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/
    ) ||
    url.match(
      /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
    ) ||
    url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);

  if (match && match[2].length === 11) {
    return "https" + "://www.youtube.com/embed/" + match[2] + "?showinfo=0";
  }
  if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
    // eslint-disable-line no-cond-assign
    return (
      (match[1] || "https") + "://player.vimeo.com/video/" + match[2] + "/"
    );
  }
  return null;
}
