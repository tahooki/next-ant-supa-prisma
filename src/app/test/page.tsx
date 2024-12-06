'use client';

import { Image } from "@/models/image.model";
import { upload } from "@/utils/supabase/upload";
import { useState } from "react";

export default function TestPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    try {
      // 'images' 는 Supabase storage bucket 이름입니다
      const url = await upload(selectedImage, "nasp", {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });

      const image = new Image();
      image.url = url as string;
      image.name = selectedImage.name;
      await image.save();
      console.log('image', image);

      // 업로드된 이미지 URL 생성
      setUploadedImageUrl(image.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">이미지 업로드 테스트</h1>
      
      <div className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="mb-4"
          />
        </div>

        <div>
          <button
            onClick={handleUpload}
            disabled={!selectedImage || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isLoading ? "업로드 중..." : "업로드"}
          </button>
        </div>

        {uploadedImageUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">업로드된 이미지:</h2>
            <img
              src={uploadedImageUrl}
              alt="Uploaded image"
              className="max-w-full h-auto rounded shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
} 