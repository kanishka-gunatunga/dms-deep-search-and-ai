// components/RemindersCalendar.tsx

import React, { useState } from 'react';
import { Calendar, Modal, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { BsClock } from 'react-icons/bs';
// import styles from '../styles/RemindersCalendar.module.css';

// Define the type for our event data
interface EventData {
    date: string; // Format: 'YYYY-MM-DD'
    title: string;
    description: string;
    color: string;
}

// Sample event data
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

const RemindersCalendar: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    const showModal = (event: EventData) => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedEvent(null);
    };

    // This function renders the custom content for each date cell
    const dateCellRender = (value: Dayjs) => {
        const dateStr = value.format('YYYY-MM-DD');
        const eventsForDate = eventData.filter((event) => event.date === dateStr);

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
                        <span className="eventDot" style={{ backgroundColor: event.color }}></span>
                        <span>{event.title}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="calendarWrapper">
                {/* Component Header */}
                <div className="d-flex flex-row align-items-center mb-3">
                    <div className="text-warning fs-4 me-2">
                        <BsClock />
                    </div>
                    <h5 className="mb-0 fw-bold" style={{ color: '#444' }}>
                        Reminders
                    </h5>
                </div>

                {/* Ant Design Calendar */}
                <Calendar
                    defaultValue={dayjs('2025-10-01')} // Set default view to October 2025
                    cellRender={dateCellRender}
                />
            </div>

            {/* Event Details Modal */}
            <Modal
                title={selectedEvent?.title}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null} // Hide default OK/Cancel buttons
            >
                <p>{selectedEvent?.description}</p>
                <div className="d-flex align-items-center mt-3">
                    <span style={{color: '#888'}}>Date:</span>
                    <span className="ms-2 fw-bold">{dayjs(selectedEvent?.date).format('MMMM D, YYYY')}</span>
                </div>
            </Modal>
        </>
    );
};

export default RemindersCalendar;