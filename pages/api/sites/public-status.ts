import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { steamID } = req.query;

  if (!steamID || typeof steamID !== "string") {
    return res.status(400).json({ error: "Invalid steamID" });
  }

  const { data, error } = await supabase
    .from("generated_sites")
    .select("account_status, reports, risk_level, is_active")
    .eq("steam_id", steamID)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(200).json(data);
}
