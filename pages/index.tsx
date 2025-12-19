import React, { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { createSupabaseServer } from "../lib/supabaseServer";

type SteamProfileData = {
  displayName: string;
  avatar: string;
  profileUrl: string;
  timeCreated: string | null;
};

export default function HomePage() {
  const [steamID, setSteamID] = useState("");
  const [autoData, setAutoData] = useState<SteamProfileData | null>(null);
  const [error, setError] = useState("");
  const [accountStatus, setAccountStatus] = useState("Banned");
  const [activeReports, setActiveReports] = useState(
    `${Math.floor(600 + Math.random() * 1000)}`
  );

  const handleSteamIDChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setSteamID(id);

    if (!id) {
      setAutoData(null);
      return;
    }

    try {
      const res = await fetch(`/api/steam?steamID=${id}`);
      if (!res.ok) {
        setError("Steam profile not found.");
        setAutoData(null);
        return;
      }

      const data: SteamProfileData = await res.json();
      setAutoData(data);
      setError("");
    } catch {
      setError("Failed to fetch Steam profile.");
      setAutoData(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/sites/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        steamID,
        accountStatus,
        reports: activeReports,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to save generated site");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

const url = `${baseUrl}/profile/${steamID}?accountStatus=${encodeURIComponent(
  accountStatus
)}&activeReports=${encodeURIComponent(activeReports)}`;

window.open(url, "_blank");


  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="container">
        <div className="form-container">
          <h1>Generate Your Steam Profile Website</h1>

          <form onSubmit={handleSubmit}>
            <label>Steam ID</label>
            <input
              value={steamID}
              onChange={handleSteamIDChange}
              placeholder="Enter Steam ID"
              required
            />

            {autoData && (
              <div className="auto-fields">
                <p><strong>Name:</strong> {autoData.displayName}</p>
                <p>
                  <strong>Profile:</strong>{" "}
                  <a href={autoData.profileUrl} target="_blank" rel="noreferrer">
                    {autoData.profileUrl}
                  </a>
                </p>
                <p><strong>Created:</strong> {autoData.timeCreated}</p>
              </div>
            )}

            {error && <p className="error">{error}</p>}

            <label>Status</label>
            <select
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
            >
              <option>Banned</option>
              <option>Good</option>
              <option>Pending Case</option>
            </select>

            <label>Active Reports</label>
            <input
              type="number"
              value={activeReports}
              onChange={(e) => setActiveReports(e.target.value)}
            />

            <button type="submit">Generate Website</button>
          </form>
        </div>
      </div>
    </>
  );
}

/**
 * ✅ SERVER AUTH GUARD
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createSupabaseServer(ctx);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
