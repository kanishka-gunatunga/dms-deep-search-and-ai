import React from 'react';
import { Tag, Statistic } from 'antd';
import { BsBuilding, BsPeople, BsFileEarmarkText, BsArrowUp } from 'react-icons/bs';
// import styles from '../styles/Dashboard.module.css';

const MySector: React.FC = () => {
    return (
        <div className={`p-4 rounded-4 sectorCard`}>
            {/* Header */}
            <div className="d-flex align-items-center mb-3">
                <div className="sectorIconWrapper">
                    <BsBuilding />
                </div>
                <div>
                    <h5 className="mb-0" style={{fontSize:"18px", color:"#1A1A1A"}}>My Sector</h5>
                    <small className="text-muted" style={{fontSize:"14px", color:"#6B7280"}}>Your assigned sector information</small>
                </div>
            </div>

            {/* Sector Info */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold" style={{fontSize:"20px"}}>Healthcare</h4>
                    <Tag color="#EA580C" style={{ fontWeight: 600 }}>Active Sector</Tag>
                </div>
                <p className="text-muted small" style={{fontSize:"14px", color:"#6B7280"}}>
                    Medical services, hospitals, and healthcare facilities
                </p>
            </div>

            {/* Stats */}
            <div className="row g-3">
                <div className="col-6">
                    <div className="d-flex align-items-center">

                        <div className="d-flex flex-row align-items-center">
                            <BsPeople className="fs-5 text-muted me-2" color="#EA580C" style={{color:"#EA580C"}}/>
                            <Statistic title="Total Users" value={156} valueStyle={{ fontSize: '1.25rem', fontWeight: 600 }} />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="d-flex align-items-center">
                        <BsFileEarmarkText className="fs-4 text-muted me-2" />
                        <div>
                            <Statistic title="Documents" value={2847} valueStyle={{ fontSize: '1.25rem', fontWeight: 600 }} />
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="d-flex justify-content-end align-items-center text-success small">
                        <BsArrowUp/>
                        <span className="ms-1 fw-bold">+12% This Month</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySector;