// app/redirect-to-doc-view/[encryptedUserId]/[encryptedDocId]/page.tsx
import { redirect } from "next/navigation";

interface Params {
  encryptedUserId: string;
  encryptedDocId: string;
}

interface Props {
  params: Params;
}

export default async function RedirectToDocView({ params }: Props) {
  const { encryptedUserId, encryptedDocId } = params;

  try {
    // Call your Laravel API to verify the encrypted IDs
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/verify-doc-link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encrypted_user: encryptedUserId,
          encrypted_doc: encryptedDocId,
        }),
        cache: "no-store", // important for server-side fetch
      }
    );

    const data = await res.json();

    if (data.status !== "success") {
      // Show error page if verification fails
      return (
        <div style={{ padding: 20 }}>
          <h1>Invalid or Expired Link</h1>
          <p>{data.message}</p>
        </div>
      );
    }

    // Auto-login → redirect with token
    redirect(`/document-view?token=${data.token}`);
  } catch (error) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Error</h1>
        <p>{(error as Error).message}</p>
      </div>
    );
  }
}
