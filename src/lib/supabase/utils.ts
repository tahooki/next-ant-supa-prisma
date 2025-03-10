import { requestGet } from "@/app/(apis)/model.api";
import { createClient } from "@/lib/supabase/server";

export async function refreshUserModel(userId: string) {
  try {
    const res = await requestGet("user", {
      auth: userId,
    });

    if (res.data) {
      const supabase = await createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          user_model: res.data,
          last_updated: new Date().toISOString(),
        },
      });

      if (error) throw error;
      return res.data;
    }
  } catch (error) {
    console.error("Error refreshing user model:", error);
    throw error;
  }
}
