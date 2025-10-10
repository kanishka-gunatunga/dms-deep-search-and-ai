import React, {useState} from 'react';
import {Button, Modal, Calendar, Tag} from 'antd';
import {BsEye, BsDownload, BsArrowRepeat, BsExclamationTriangleFill} from 'react-icons/bs';
import dayjs, {Dayjs} from 'dayjs';
// import styles from '../styles/Documents.module.css';

// Define the type for a document
interface Document {
    id: string;
    title: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    sector: string;
    expiryDate: string; // ISO format 'YYYY-MM-DD'
}

// Mock data for the documents
const initialDocuments: Document[] = [
    {
        id: 'DOC-2024-005',
        title: 'Manufacturing Compliance',
        priority: 'HIGH',
        category: 'Compliance',
        sector: 'Manufacturing',
        expiryDate: '2025-10-17'
    },
    {
        id: 'DOC-2024-004',
        title: 'Employee Training Certificate',
        priority: 'MEDIUM',
        category: 'HR Documents',
        sector: 'Education',
        expiryDate: '2025-10-19'
    },
    {
        id: 'DOC-2024-003',
        title: 'Financial Audit Report',
        priority: 'MEDIUM',
        category: 'Financial',
        sector: 'Finance',
        expiryDate: '2025-10-21'
    },
    {
        id: 'DOC-2024-002',
        title: 'Software License Contract',
        priority: 'MEDIUM',
        category: 'Contracts',
        sector: 'Technology',
        expiryDate: '2025-11-02'
    },
    {
        id: 'DOC-2024-001',
        title: 'Healthcare Policy Agreement',
        priority: 'LOW',
        category: 'Policy Documents',
        sector: 'Healthcare',
        expiryDate: '2025-11-06'
    },
];

// Helper to get color based on priority
const getPriorityTag = (priority: Document['priority']) => {
    switch (priority) {
        case 'HIGH':
            return <Tag color="red">HIGH</Tag>;
        case 'MEDIUM':
            return <Tag color="orange">MEDIUM</Tag>;
        case 'LOW':
            return <Tag color="blue">LOW</Tag>;
        default:
            return <Tag>{priority}</Tag>;
    }
};

const NearlyExpiredDocuments: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [newExpiryDate, setNewExpiryDate] = useState<Dayjs | null>(null);

    const calculateDaysLeft = (expiryDate: string) => {
        return dayjs(expiryDate).diff(dayjs(), 'day');
    };

    // --- Modal Handlers ---
    const handleRenewClick = (doc: Document) => {
        setSelectedDocument(doc);
        setNewExpiryDate(dayjs(doc.expiryDate)); // Pre-fill calendar with current expiry date
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedDocument(null);
    };

    const handleConfirmRenewal = () => {
        if (!selectedDocument || !newExpiryDate) return;

        // Update the document list state
        setDocuments(prevDocs =>
            prevDocs.map(doc =>
                doc.id === selectedDocument.id
                    ? {...doc, expiryDate: newExpiryDate.format('YYYY-MM-DD')}
                    : doc
            )
        );
        handleModalCancel(); // Close modal after update
    };

    return (
        <>
            <div className="calendarWrapper" style={{marginTop: "20px"}}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <BsExclamationTriangleFill className="text-warning"/>
                        <h5 className="mb-0">Nearly Expired Documents</h5>
                        <Tag color="red">{documents.length} Documents</Tag>
                    </div>
                    <Button icon={<BsArrowRepeat/>}>Refresh</Button>
                </div>

                {/* Documents List */}
                <div>
                    {documents.sort((a, b) => calculateDaysLeft(a.expiryDate) - calculateDaysLeft(b.expiryDate)).map((doc) => {
                        const daysLeft = calculateDaysLeft(doc.expiryDate);
                        return (
                            <div key={doc.id} className="documentCard">
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <h6 className="mb-0">{doc.title}</h6>
                                            {getPriorityTag(doc.priority)}
                                        </div>
                                        <div className="documentMeta">
                                            <span>ID: {doc.id}</span>
                                            <span>Category: {doc.category}</span>
                                            <span>Sector: {doc.sector}</span>
                                        </div>
                                        <small>Expired: {dayjs(doc.expiryDate).format('YYYY-MM-DD')} <span
                                            className="daysLeft">{daysLeft} days left</span></small>
                                    </div>
                                    <div
                                        className="col-12 col-md-6 d-flex justify-content-md-end align-items-center gap-2">
                                        <Button type="text" icon={<BsEye/>}/>
                                        <Button type="text" icon={<BsDownload/>}/>
                                        <Button onClick={() => handleRenewClick(doc)}>Renew</Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="d-flex justify-content-between align-items-center mt-4 text-muted">
                    <small>Showing {documents.length} documents</small>
                    <a href="#" className="fw-bold text-decoration-none">View All Expired Documents</a>
                </div>
            </div>

            {/* Renewal Modal */}
            <Modal
                title={`Renew: ${selectedDocument?.title}`}
                open={isModalVisible}
                onOk={handleConfirmRenewal}
                onCancel={handleModalCancel}
                okText="Confirm Renewal"
                cancelText="Cancel"
            >
                <p>Select a new expiry date for this document.</p>
                <div className="d-flex justify-content-center p-2 border rounded">
                    <Calendar
                        fullscreen={false}
                        value={newExpiryDate}
                        onSelect={(date) => setNewExpiryDate(date)}
                        // Prevent selecting past dates for renewal
                        disabledDate={(current) => current && current < dayjs().endOf('day')}
                    />
                </div>
            </Modal>
        </>
    );
};

export default NearlyExpiredDocuments;