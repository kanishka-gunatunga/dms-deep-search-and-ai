"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getWithAuth, API_BASE_URL } from "@/utils/apiClient";
import { Modal } from "react-bootstrap";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface Props {
  params: {
    encryptedUserId: string;
    encryptedDocId: string;
  };
}

interface Attribute {
  attribute: string;
  value: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  type: string;
}

interface ViewDocumentItem {
  id: number;
  name: string;
  category: { id: number; category_name: string };
  description: string;
  meta_tags: string;
  attributes: string;
  type: string;
  url: string;
  enable_external_file_view: number;
}

const RedirectToDocViewPage = ({ params }: Props) => {
  const { encryptedUserId, encryptedDocId } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewDocument, setViewDocument] = useState<ViewDocumentItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    const autoLoginAndFetchDoc = async () => {
      try {
        const existingToken = Cookies.get("authToken");
        let documentId = encryptedDocId;

        if (!existingToken) {
          const res = await fetch(`${API_BASE_URL}/auto-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              encrypted_user: encryptedUserId,
              encrypted_doc: encryptedDocId,
            }),
          });

          const data = await res.json();

          if (data.status !== "success") {
            setError(data.message || "Auto-login failed");
            setLoading(false);
            return;
          }

          const token: string = data.data.token;
          const user: UserData = data.data.user;
          documentId = data.data.document_id;

        const expiresIn = 1; // 1 day
        Cookies.set("authToken", token, { expires: expiresIn, secure: true, sameSite: "strict" });
        Cookies.set("userId", user.id.toString(), { expires: expiresIn }); // convert number -> string
        Cookies.set("userEmail", user.email, { expires: expiresIn });
        Cookies.set("userType", user.type, { expires: expiresIn });
        Cookies.set("userName", user.name, { expires: expiresIn });
        }

        const userId = Cookies.get("userId");
       const docResponse = await getWithAuth(`view-document/${documentId}/${userId}`);
        const docData: ViewDocumentItem = docResponse.data; // manually type here


        setViewDocument(docData);
        setMetaTags(JSON.parse(docData.meta_tags || "[]"));
        setAttributes(JSON.parse(docData.attributes || "[]"));
        setModalVisible(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load document");
        setLoading(false);
      }
    };

    autoLoginAndFetchDoc();
  }, [encryptedUserId, encryptedDocId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {modalVisible && viewDocument && (
        <Modal
          centered
          show={modalVisible}
          fullscreen
          onHide={() => setModalVisible(false)}
        >
          <Modal.Header>
            <div className="d-flex w-100 justify-content-end">
              <div className="col-11 d-flex flex-row">
                <p className="mb-0" style={{ fontSize: "16px", color: "#333" }}>
                  View Document: {viewDocument.name}
                </p>
              </div>
              <div className="col-1 d-flex justify-content-end">
                <IoClose
                  fontSize={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalVisible(false)}
                />
              </div>
            </div>
          </Modal.Header>

          <Modal.Body className="p-2 p-lg-4">
            <div className="d-flex preview-container">
              {/* Image Preview */}
              {["jpg","jpeg","png","gif","bmp","webp","svg","tiff","ico","avif"].includes(viewDocument.type) && (
                <Image src={viewDocument.url} alt={viewDocument.name} width={600} height={600} />
              )}

              {/* PDF Preview */}
              {viewDocument.type === "pdf" && (
                <iframe
                  src={viewDocument.url}
                  title="PDF Preview"
                  style={{ width: "100%", height: "500px", border: "none" }}
                />
              )}

              {/* Office Docs Preview */}
              {viewDocument.enable_external_file_view === 1 && (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewDocument.url)}`}
                  title="Office Preview"
                  style={{ width: "100%", height: "500px", border: "none" }}
                />
              )}
            </div>

            <p>Meta tags: {metaTags.map((tag, idx) => (
              <span key={idx} className="badge bg-primary me-2">{tag}</span>
            ))}</p>

            <p>Attributes: {attributes.map((attr, idx) => (
              <span key={idx} className="badge bg-secondary me-2">{attr.attribute}: {attr.value}</span>
            ))}</p>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default RedirectToDocViewPage;
