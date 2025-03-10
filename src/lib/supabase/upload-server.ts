import { createClient } from "@/lib/supabase/server";

export async function uploadToSupabase(
  content: string,
  bucket: string,
  filePath: string
) {
  const supabase = await createClient();

  // Get session and access token
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  // Convert string content to Blob
  const blob = new Blob([content], { type: "application/javascript" });
  const file = new File([blob], filePath, { type: "application/javascript" });

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: "application/javascript",
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
