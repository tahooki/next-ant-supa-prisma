import dynamic from "next/dynamic";

export const QuillEditorClient = dynamic(
  () => import("@/components/QuillEditor/QuillEditor"), // This should be the path to your Phaser game component
  { ssr: false }
);
