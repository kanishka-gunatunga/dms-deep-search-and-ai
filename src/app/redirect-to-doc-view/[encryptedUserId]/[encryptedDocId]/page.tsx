"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/apiClient";

interface Props {
  params: {
    encryptedUserId: string;
    encryptedDocId: string;
  };
}

const RedirectToDocViewPage = ({ params }: Props) => {
  const { encryptedUserId, encryptedDocId } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToDoc = async () => {
      const existingToken = Cookies.get("authToken");

      if (existingToken) {
        // If user already has a valid token, skip auto-login
        router.replace(`/all-documents`);
        return;
      }

      try {
        // Auto-login request to Laravel
        const res = await fetch(
          `${API_BASE_URL}/auto-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              encrypted_user: encryptedUserId,
              encrypted_doc: encryptedDocId,
            }),
          }
        );

        const data = await res.json();

        if (data.status !== "success") {
          setError(data.message || "Auto-login failed");
          setLoading(false);
          return;
        }

        // Set cookies for user session
        const token = data.data.token;
        const user = data.data.user;

        Cookies.set("authToken", token, { secure: true, sameSite: "strict" });
        Cookies.set("userId", user.id);
        Cookies.set("userEmail", user.email);
        Cookies.set("userName", user.name);

        // Redirect to document view
        router.replace(`/all-documents`);
      } catch (err) {
        setError("Auto-login failed");
        setLoading(false);
      }
    };

    redirectToDoc();
  }, [encryptedUserId, encryptedDocId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return null;
};

export default RedirectToDocViewPage;
