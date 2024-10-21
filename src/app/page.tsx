import { createClient } from "@/utils/supabase/server";
import HomeTemplate from "./home-template";

export default async function Home() {

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  
  return (
    <HomeTemplate user={user} />
  );
}
