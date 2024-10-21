"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "antd";

const HomeTemplate = ({user}: {user?: any}) => {
  const supabase = createClient();
  return <div>
    HomeTemplate
    {user ? <div>
      <Button onClick={() => {
        supabase.auth.signOut().then(() => {
          window.location.reload();
        });
      }}>Logout</Button>
    </div> : <div>
      <Button onClick={() => {
        window.location.href = "/login";
      }}>Login</Button>
      <Button type="primary" onClick={() => {
        window.location.href = "/signup";
      }}>Signup</Button>
    </div>}
  </div>;
};

export default HomeTemplate;  