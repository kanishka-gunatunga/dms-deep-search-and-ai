import React from 'react';
import {Button, Tag, Table} from 'antd';
import type {TableProps} from 'antd';
import {BsEye, BsDownload} from 'react-icons/bs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from "next/image";
// import styles from '../styles/AssignedFiles.module.css';

dayjs.extend(relativeTime);

interface FileData {
    id: string;
    title: string;
    size: string;
    assignedDate: string;
    isNew: boolean;
    category: string;
    dueDate: string;
}

const filesData: FileData[] = [
    {
        id: 'DOC-2024-052',
        title: 'Emergency Response Protocol Update',
        size: '1.5 MB',
        assignedDate: '2025-10-08',
        isNew: true,
        category: 'Safety Protocols',
        dueDate: '2025-10-22'
    },
    {
        id: 'DOC-2024-053',
        title: 'New Patient Intake Form',
        size: '845 KB',
        assignedDate: '2025-10-06',
        isNew: true,
        category: 'Forms',
        dueDate: '2025-10-25'
    },
    {
        id: 'DOC-2024-054',
        title: 'Quality Assurance Checklist',
        size: '1.2 MB',
        assignedDate: '2025-10-02',
        isNew: true,
        category: 'Quality Control',
        dueDate: '2025-10-30'
    },
    {
        id: 'DOC-2024-055',
        title: 'Insurance Policy Changes',
        size: '2.1 MB',
        assignedDate: '2025-09-30',
        isNew: true,
        category: 'Insurance',
        dueDate: '2025-11-01'
    },
    {
        id: 'DOC-2024-048',
        title: 'Insurance Claims Processing Manual',
        size: '3.2 MB',
        assignedDate: '2025-09-20',
        isNew: false,
        category: 'Procedures',
        dueDate: '2025-10-30'
    },
    {
        id: 'DOC-2024-047',
        title: 'Medical Equipment Certification',
        size: '956 KB',
        assignedDate: '2025-09-15',
        isNew: false,
        category: 'Certificates',
        dueDate: '2025-10-25'
    },
];

const AssignedFiles: React.FC = () => {

    const columns: TableProps<FileData>['columns'] = [
        {
            title: 'DOCUMENT',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0" style={{color:"#1A1A1A", fontSize:"14px"}}>{text}</h6>
                        {record.isNew && <Tag color="#EA580C">NEW</Tag>}
                    </div>
                    <small className="text-muted">
                        ID: {record.id} • {record.size} <span style={{color:"#EA580C"}}> • Assigned {dayjs(record.assignedDate).fromNow()}</span>
                    </small>
                </div>
            ),
        },
        {
            title: 'CATEGORY',
            dataIndex: 'category',
            key: 'category',
            render: (category) => <Tag>{category}</Tag>,
        },
        {
            title: 'DUE DATE',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (dueDate) => {
                const daysLeft = dayjs(dueDate).diff(dayjs(), 'day');
                return (
                    <div>
                        <div className="" style={{color:"#1A1A1A", fontSize:"14px"}}>{dueDate}</div>
                        <small className="text-muted">{daysLeft} days left</small>
                    </div>
                );
            },
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            align: 'left',
            render: () => (
                <div>
                    <Button type="text" shape="circle" icon={<BsEye/>}/>
                    <Button type="text" shape="circle" icon={<BsDownload/>}/>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white h-100 calendarWrapper">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                    <Image src="/jam_document.svg" alt="icon document" width={24} height={24} />
                    <h5 className="mb-0" style={{color:"#0A0A0A", fontSize:"16px", fontFamily:"Arial"}}>My Assigned Files</h5>
                    <Tag style={{color:"#EA580C"}}>8 files</Tag>
                    <Tag color="#EA580C">4 new</Tag>
                </div>
                <Button type="text" style={{color:"#1A1A1A", padding:"4px 10px", border:"1px solid #E5E7EB", borderRadius:"5px"}}>View All</Button>
            </div>

            {/* Ant Design Table */}
            <Table
                columns={columns}
                dataSource={filesData}
                pagination={false}
                rowKey="id"
                rowClassName={(record) => record.isNew ? 'newRow' : ''}
            />

            <div className="d-flex justify-content-between align-items-center mt-4" style={{fontSize:"14px", borderTop:"1px solid #E5E7EB", paddingTop:"10px", marginTop:"10px"}}>
                <small className="text-muted" style={{color:"#6B7280"}}>Showing 8 assigned files <span style={{color:"#EA580C"}}> (4 newly assigned)</span></small>
                <Button type="text" style={{color:"#EA580C"}}>Load More Files</Button>
            </div>
        </div>
    );
};

export default AssignedFiles;