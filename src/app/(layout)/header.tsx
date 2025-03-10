"use client";

import Navigation from "@/components/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "antd";

const supabase = await createClient();

const LayoutHeader = ({ user }: { user?: any }) => {
  return (
    <div>
      <Navigation />
      {user && (
        <div>
          {user?.email}

          <Button
            onClick={() => {
              supabase.auth.signOut();
            }}
          >
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
};

export default LayoutHeader;
