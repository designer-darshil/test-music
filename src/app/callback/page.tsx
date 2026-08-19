"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requestAccessToken } from "@/lib/spotify/auth";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      requestAccessToken(code)
        .then(() => {
          // Success, go to home
          router.push("/");
        })
        .catch(err => {
          console.error(err);
          setError("Failed to authenticate with Spotify.");
        });
    } else {
      setError("No authorization code found.");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950 text-white">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="animate-pulse">Authenticating with Spotify...</div>
      )}
    </div>
  );
}
