import React, {useState} from 'react';
import {Calendar, Modal} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import Image from "next/image";

// import styles from '../styles/RemindersCalendar.module.css';

interface EventData {
    date: string;
    title: string;
    description: string;
    color: string;
}

const eventData: EventData[] = [
    {
        date: '2025-10-08',
        title: 'Contract Review',
        description: 'Final review of the Q4 client contract. All stakeholders must attend.',
        color: '#E84A4A',
    },
    {
        date: '2025-10-15',
        title: 'Team Meeting',
        description: 'Weekly team sync meeting to discuss project progress.',
        color: '#3E7BFF',
    },
    {
        date: '2025-10-15',
        title: 'Deploy to Prod',
        description: 'Scheduled production deployment for version 2.5.',
        color: '#00B887',
    },
];

interface Reminder {
    date: string;
    content: string;
    type: "success" | "processing" | "error" | "default" | "warning";
}

interface RemindersCalendarProps {
    reminders: Reminder[];
}

const RemindersCalendar: React.FC<RemindersCalendarProps> = ({reminders}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Reminder | null>(null);

    const showModal = (event: Reminder) => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedEvent(null);
    };

    const getColorFromType = (type: Reminder['type']) => {
        const colorMap = {
            success: '#52c41a',
            warning: '#faad14',
            error: '#f5222d',
            processing: '#1890ff',
            default: '#d9d9d9'
        };
        return colorMap[type] || colorMap.default;
    };

    const dateCellRender = (value: Dayjs) => {
        const dateStr = value.format('YYYY-MM-DD');
        const eventsForDate = reminders.filter((event) => event.date === dateStr);

        if (eventsForDate.length === 0) {
            return null;
        }

        return (
            <div className="events-container">
                {eventsForDate.map((event, index) => (
                    <div
                        key={index}
                        className="eventItem"
                        onClick={() => showModal(event)}
                    >
                        <span className="eventDot" style={{backgroundColor: getColorFromType(event.type)}}></span>
                        <span>{event.content}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="calendarWrapper">
                <div className="d-flex flex-row align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <Image src="/time.svg" alt="time icon" width={20} height={20}/>

                        <h5 className="mb-0" style={{color: '#0A0A0A', fontSize: '16px'}}>
                            Reminders
                        </h5>
                    </div>
                </div>

                <Calendar
                    defaultValue={dayjs('2025-10-12')}
                    cellRender={dateCellRender}
                />
            </div>

            <Modal
                title={selectedEvent?.content}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <p>{selectedEvent?.content}</p>
                <div className="d-flex align-items-center mt-3">
                    <span style={{color: '#888'}}>Date:</span>
                    <span className="ms-2 fw-bold">{dayjs(selectedEvent?.date).format('MMMM D, YYYY')}</span>
                </div>
            </Modal>
        </>
    );
};

export default RemindersCalendar;