import React, {useEffect, useState} from 'react';
import {Button, Modal, Calendar, Tag, message} from 'antd';
import {BsEye, BsDownload, BsArrowRepeat} from 'react-icons/bs';
import dayjs, {Dayjs} from 'dayjs';
import Image from "next/image";
import {handleDownload, handleView} from "@/utils/documentFunctions";
import {postWithAuth} from "@/utils/apiClient";


interface NearExpiryDocument {
    id: number;
    name: string;
    category_name: string;
    sector_name: string;
    expiration_date: string;
    days_to_expire: number;
}

interface NearlyExpiredDocumentsProps {
    initialDocuments: NearExpiryDocument[];
    userId: string | null;
    isAdmin: number | undefined;
    onRefresh: () => void;
}

const getPriorityTag = (daysLeft: number) => {
    if (daysLeft <= 3) {
        return <Tag color="red">HIGH</Tag>;
    }
    if (daysLeft <= 10) {
        return <Tag color="orange">MEDIUM</Tag>;
    }
    return <Tag color="blue">LOW</Tag>;
};

const NearlyExpiredDocuments: React.FC<NearlyExpiredDocumentsProps> = ({initialDocuments, userId, isAdmin, onRefresh}) => {
    const [documents, setDocuments] = useState<NearExpiryDocument[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<NearExpiryDocument | null>(null);
    const [newExpiryDate, setNewExpiryDate] = useState<Dayjs | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setDocuments(initialDocuments);
    }, [initialDocuments]);

    const handleRenewClick = (doc: NearExpiryDocument) => {
        setSelectedDocument(doc);
        setNewExpiryDate(dayjs(doc.expiration_date));
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedDocument(null);
    };

    // const handleConfirmRenewal = () => {
    //     if (!selectedDocument || !newExpiryDate) return;
    //
    //     setDocuments(prevDocs =>
    //         prevDocs.map(doc =>
    //             doc.id === selectedDocument.id
    //                 ? {...doc, expiration_date: newExpiryDate.format('YYYY-MM-DD')}
    //                 : doc
    //         )
    //     );
    //     handleModalCancel();
    // };

    const handleConfirmRenewal = async () => {
        if (!selectedDocument || !newExpiryDate) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append('document_id', selectedDocument.id.toString());
        formData.append('expire_date', newExpiryDate.format('YYYY-MM-DD'));

        try {
            const response = await postWithAuth('renew-document', formData);

            if (response.status === 'success') {
                message.success('Document renewed successfully!');

                setDocuments(prevDocs =>
                    prevDocs.map(doc =>
                        doc.id === selectedDocument.id
                            ? {...doc, expiration_date: newExpiryDate.format('YYYY-MM-DD')}
                            : doc
                    )
                );
                handleModalCancel();
            } else {
                message.error(response.message || 'Failed to renew the document.');
            }
        } catch (error) {
            console.error("Error renewing document:", error);
            message.error('An error occurred while renewing the document.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="calendarWrapper" style={{marginTop: "20px", marginBottom: '90px'}}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <Image src="/warning.svg" alt="warning icon" width={20} height={20}/>
                        <h5 className="mb-0" style={{color: '#0A0A0A', fontSize: '16px', fontWeight: 'normal'}}>Nearly
                            Expired Documents</h5>
                        {documents.length > 0 && <Tag color="red">{documents.length} Documents</Tag>}
                    </div>
                    <Button icon={<BsArrowRepeat/>} onClick={onRefresh}>Refresh</Button>
                </div>

                <div>
                    {documents
                        .sort((a, b) => a.days_to_expire - b.days_to_expire)
                        .map((doc) => (
                            <div key={doc.id} className="documentCard">
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <h6 className="mb-0"
                                                style={{color: '#0A0A0A', fontSize: '14px'}}>{doc.name}</h6>
                                            {getPriorityTag(doc.days_to_expire)}
                                        </div>
                                        <div className="documentMeta">
                                            <span>ID: DOC-{doc.id}</span>
                                            <span>Category: {doc.category_name}</span>
                                            <span>Sector: {doc.sector_name}</span>
                                        </div>
                                        <small
                                            className="documentMeta">Expires: {dayjs(doc.expiration_date).format('YYYY-MM-DD')}
                                            <span
                                                className="daysLeft">{doc.days_to_expire} days left</span></small>
                                    </div>
                                    <div
                                        className="col-12 col-md-6 d-flex justify-content-md-end align-items-center gap-2">
                                        <Button type="text" icon={<BsEye/>} onClick={() => handleView(doc.id, userId)}/>
                                        <Button type="text" icon={<BsDownload/>}
                                                onClick={() => handleDownload(doc.id, userId)}/>

                                        {isAdmin === 1 && (
                                            <Button onClick={() => handleRenewClick(doc)}>Renew</Button>
                                        )}
                                        {/*<Button onClick={() => handleRenewClick(doc)}>Renew</Button>*/}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 text-muted"
                     style={{fontSize: '14px', borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '10px'}}>
                    <small style={{color: '#717182'}}>Showing {documents.length} documents</small>
                    <a href="#" className="text-decoration-none" style={{color: '#F54900'}}>View All Expired
                        Documents</a>
                </div>
            </div>

            <Modal
                title={`Renew: ${selectedDocument?.name}`}
                open={isModalVisible}
                confirmLoading={isLoading}
                onOk={handleConfirmRenewal}
                onCancel={handleModalCancel}
                okText="Confirm Renewal"
            >
                <p>Select a new expiry date for this document.</p>
                <div className="d-flex justify-content-center p-2 border rounded">
                    <Calendar
                        fullscreen={false}
                        value={newExpiryDate}
                        onSelect={(date) => setNewExpiryDate(date)}
                        disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                    />
                </div>
            </Modal>
        </>
    );
};

export default NearlyExpiredDocuments;