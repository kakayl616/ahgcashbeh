import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { steam_id, account_status, reports } = req.body;

  if (!steam_id || account_status === undefined || reports === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { error } = await supabase
    .from("generated_sites")
    .update({
      account_status,
      reports
    })
    .eq("steam_id", steam_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
