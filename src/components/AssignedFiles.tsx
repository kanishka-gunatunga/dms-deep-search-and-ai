import React from 'react';
import {Button, Tag, Table} from 'antd';
import type {TableProps} from 'antd';
import {BsEye, BsDownload} from 'react-icons/bs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from "next/image";
import {handleDownload, handleView} from "@/utils/documentFunctions";
import Link from "next/link";
// import styles from '../styles/AssignedFiles.module.css';

dayjs.extend(relativeTime);

export interface AssignedDocument {
    id: number;
    document_name: string;
    category_name: string;
    expiration_date: string | null;
    is_new: number;
    days_since_added: number;
}

interface AssignedFilesProps {
    documents: AssignedDocument[];
    userId: string | null;
}

const AssignedFiles: React.FC<AssignedFilesProps> = ({documents, userId}) => {

    const columns: TableProps<AssignedDocument>['columns'] = [
        {
            title: 'DOCUMENT',
            dataIndex: 'document_name',
            key: 'document_name',
            render: (text, record) => (
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0" style={{color: "#1A1A1A", fontSize: "14px"}}>{text}</h6>
                        {record.is_new === 1 && <Tag color="#EA580C">NEW</Tag>}
                    </div>
                    <small className="text-muted">
                        ID: {record.id} • {' '} <span
                        style={{color: "#EA580C"}}> Assigned {record.days_since_added} days ago</span>
                    </small>
                </div>
            ),
        },
        {
            title: 'CATEGORY',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (category) => <Tag>{category}</Tag>,
        },
        {
            title: 'DUE DATE',
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            render: (dueDate) => {
                if (!dueDate) return <small className="text-muted">N/A</small>;
                const daysLeft = dayjs(dueDate).diff(dayjs(), 'day');
                return (
                    <div>
                        <div className="" style={{color: "#1A1A1A", fontSize: "14px"}}>{dueDate}</div>
                        {/*<small className="text-muted">{daysLeft} days left</small>*/}
                        <small className={daysLeft < 0 ? 'text-danger fw-bold' : 'text-muted'}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </small>
                    </div>
                );
            },
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            align: 'left',
            render: (_, record) => (
                <div>
                    <Button type="text" shape="circle" icon={<BsEye/>} onClick={() => handleView(record.id, userId)}/>
                    <Button type="text" shape="circle" icon={<BsDownload/>}
                            onClick={() => handleDownload(record.id, userId)}/>
                </div>
            ),
        },
    ];

    const newFilesCount = documents.filter(doc => doc.is_new === 1).length;

    return (
        <div className="bg-white h-100 calendarWrapper">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <Image src="/jam_document.svg" alt="icon document" width={24} height={24}/>
                    <h5 className="mb-0" style={{color: "#0A0A0A", fontSize: "16px", fontFamily: "Arial"}}>My Assigned
                        Files</h5>
                    <Tag style={{color: "#EA580C"}}>{documents.length} files</Tag>
                    <Tag color="#EA580C">{newFilesCount} new</Tag>
                </div>
                <Link href="/assigned-documents">
                    <Button type="text" style={{
                        color: "#1A1A1A",
                        padding: "4px 10px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "5px"
                    }}>View All</Button>
                </Link>
            </div>

            {/* Ant Design Table */}
            <Table
                columns={columns}
                dataSource={documents}
                pagination={false}
                rowKey="id"
                rowClassName={(record) => record.is_new === 1 ? 'newRow' : ''}
            />

            <div className="d-flex justify-content-between align-items-center mt-4"
                 style={{fontSize: "14px", borderTop: "1px solid #E5E7EB", paddingTop: "10px", marginTop: "10px"}}>
                <small className="text-muted" style={{color: "#6B7280"}}>Showing {documents.length} assigned
                    files {newFilesCount > 0 &&
                        <span style={{color: "#EA580C"}}> ({newFilesCount} newly assigned)</span>}</small>
                <Link href="/assigned-documents">
                    <Button type="text" style={{color: "#EA580C"}}>Load More Files</Button>
                </Link>
            </div>
        </div>
    );
};

export default AssignedFiles;