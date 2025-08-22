// lib/load-session.ts
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const loadSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    redirect("/login");
  }
  return data.session;
};

export default loadSession;
