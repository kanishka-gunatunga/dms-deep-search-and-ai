/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import styles from "./page.module.css";
import Heading from "@/components/common/Heading";
import {PieChart, Pie, Legend, ResponsiveContainer, Cell} from "recharts";
import InfoModal from "@/components/common/InfoModel";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {useEffect, useState} from "react";
import {fetchRemindersData} from "@/utils/dataFetchFunctions";
import {Badge, Calendar} from "antd";
import type {BadgeProps, CalendarProps} from "antd";
import type {Dayjs} from "dayjs";
import StatCard from "@/components/StatCard";
import {BsBriefcaseFill, BsFileEarmarkText, BsPerson} from "react-icons/bs";
import PieChartCard from "@/components/PieChartCard";
import RemindersCalendar from "@/components/RemindersCalendar";
import NearlyExpiredDocuments from "@/components/NearlyExpiredDocuments";


type Reminder = {
    id: number;
    subject: string;
    start_date_time: string | null;
};

type SelectedDate = {
    date: string;
    content: string;
    type: "success" | "processing" | "error" | "default" | "warning";
};

export default function Home() {
    const isAuthenticated = useAuth();
    const data01 = [
        {
            name: "Invoice",
            value: 400,
            color: "#8884d8",
        },
        {
            name: "HR Employee fee",
            value: 300,
            color: "#888458",
        },
        {
            name: "Test Documents",
            value: 300,
            color: "#887778",
        },
    ];

    // const [selectedDates, setSelectedDates] = useState<{ date: string; content: string; type: BadgeProps["status"] }[]>([
    //   { date: "2024-12-15", content: "Meeting with client", type: "success" },
    //   { date: "2024-12-08", content: "Project deadline", type: "warning" },
    //   { date: "2024-12-10", content: "Code review session", type: "error" },
    // ]);

    const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);


    useEffect(() => {
        // const transformRemindersToDates = (reminders: any[]) => {
        //   return reminders.map((reminder) => ({
        //     date: reminder.start_date_time.split(" ")[0],
        //     content: reminder.subject,
        //     type: "success" as const,
        //   }));
        // };

        // fetchRemindersData((data: any[]) => {
        //   const transformedData = transformRemindersToDates(data);
        //   setSelectedDates(transformedData);
        // });

        fetchRemindersData((data) => {
            const transformedData = data
                .filter((reminder: { start_date_time: any; }) => reminder.start_date_time)
                .map((reminder: { start_date_time: any; subject: any; }) => ({
                    date: reminder.start_date_time!.split(" ")[0],
                    content: reminder.subject,
                    type: "success",
                }));
            setSelectedDates(transformedData);
        });
    }, []);

    const getListData = (value: Dayjs) => {
        const formattedDate = value.format("YYYY-MM-DD");
        return selectedDates.filter((item) => item.date === formattedDate);
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => (
                    <li key={index}>
                        <Badge status={item.type} text={item.content}/>
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") return dateCellRender(current);
        return info.originNode;
    };

    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
        console.log(value.format("YYYY-MM-DD"), mode);
    };


    if (!isAuthenticated) {
        return <LoadingSpinner/>;
    }


    const categoryData = [
        {name: 'Payment Vouchers', value: 45, color: '#885AF5'},
        {name: 'Agent Files', value: 30, color: '#00B887'},
        {name: 'Personal Files', value: 25, color: '#3E7BFF'},
    ];

    const sectorData = [
        {name: 'Healthcare', value: 28, color: '#FF9E2A'},
        {name: 'Finance', value: 25, color: '#3E7BFF'},
        {name: 'Technology', value: 20, color: '#00B887'},
        {name: 'Education', value: 15, color: '#885AF5'},
        {name: 'Manufacturing', value: 12, color: '#E84A4A'},
    ];


    return (
        <div className={styles.page}>
            <DashboardLayout>
                <div
                    className="d-flex flex-column custom-scroll"
                    style={{minHeight: "100vh", maxHeight: "100%", overflowY: "scroll"}}
                >
                    <div
                        className="d-flex flex-column rounded mb-3"
                        style={{marginTop: "12px"}}
                    >
                        <div className="d-flex flex-row align-items-center justify-content-between gap-1">
                            <StatCard title="Total Users" value={1247} icon="/total_user.svg" changeText="+12%"
                                      changeColorClass="positiveChange"/>
                            <StatCard title="Total Documents" value={1247} icon="/total_document.svg" changeText="+12%"
                                      changeColorClass="positiveChange"/>
                            <StatCard title="Categories" value={1247} icon="/categories.svg" changeText="+12%"
                                      changeColorClass="positiveChange"/>
                            <StatCard title="Sectors" value={12} icon="/sectors.svg" changeText="0"
                                      changeColorClass="noChange"/>
                        </div>
                    </div>
                    {/*<div className="d-flex flex-column bg-white p-2 p-lg-3 rounded">*/}
                    {/*  <div className="d-flex flex-row align-items-center">*/}
                    {/*    <Heading text="Documents by Category" color="#444" />*/}
                    {/*  </div>*/}
                    {/*  <ResponsiveContainer width="100%" height={250}>*/}
                    {/*    <PieChart>*/}
                    {/*      <Pie*/}
                    {/*        data={data01}*/}
                    {/*        dataKey="value"*/}
                    {/*        nameKey="name"*/}
                    {/*        cx="50%"*/}
                    {/*        cy="50%"*/}
                    {/*        label*/}
                    {/*        outerRadius={80}*/}
                    {/*      >*/}
                    {/*        {data01.map((entry, index) => (*/}
                    {/*          <Cell key={`cell-${index}`} fill={entry.color} />*/}
                    {/*        ))}*/}
                    {/*      </Pie>*/}
                    {/*      <Legend*/}
                    {/*        layout="vertical"*/}
                    {/*        align="right"*/}
                    {/*        verticalAlign="middle"*/}
                    {/*        height={36}*/}
                    {/*      />*/}
                    {/*    </PieChart>*/}
                    {/*  </ResponsiveContainer>*/}
                    {/*</div>*/}

                    <div className="py-4">
                        <div className="row g-4">
                            <div className="col-12 col-lg-6">
                                <PieChartCard
                                    title="Documents by Category"
                                    icon="/jam_document.svg"
                                    data={categoryData}
                                />
                            </div>

                            <div className="col-12 col-lg-6">
                                <PieChartCard
                                    title="Documents by Sector"
                                    icon="/sector-line.svg"
                                    data={sectorData}
                                />
                            </div>
                        </div>
                    </div>

                    {/*<div*/}
                    {/*  className="d-flex flex-column bg-white p-2 p-lg-3 rounded mb-3"*/}
                    {/*  style={{ marginTop: "12px" }}*/}
                    {/*>*/}
                    {/*  <div className="d-flex flex-row align-items-center">*/}
                    {/*    <Heading text="Reminders" color="#444" />*/}
                    {/*    /!* <InfoModal*/}
                    {/*      title="Sample Blog"*/}
                    {/*      content={`<h1><strong>Hello world,</strong></h1><p>The Company Profile feature allows users to customize the branding of the application by entering the company name and uploading logos. This customization will reflect on the login screen, enhancing the professional appearance and brand identity of the application.</p><br><h3><strong>Hello world,</strong></h3><p>The Company Profile feature allows users to customize the branding of the application by entering the company name and uploading logos. This customization will reflect on the login screen, enhancing the professional appearance and brand identity of the application.</p><br><h3><strong>Hello world,</strong></h3><p>The Company Profile feature allows users to customize the branding of the application by entering the company name and uploading logos. This customization will reflect on the login screen, enhancing the professional appearance and brand identity of the application.</p><br><h3><strong>Hello world,</strong></h3><p>The Company Profile feature allows users to customize the branding of the application by entering the company name and uploading logos. This customization will reflect on the login screen, enhancing the professional appearance and brand identity of the application.</p>`}*/}
                    {/*    /> *!/*/}
                    {/*  </div>*/}
                    {/*  /!* <Calendar onPanelChange={onPanelChange} /> *!/*/}
                    {/*  <Calendar cellRender={cellRender} onPanelChange={onPanelChange} />*/}

                    {/*</div>*/}
                    <RemindersCalendar/>

                    <NearlyExpiredDocuments/>
                </div>
            </DashboardLayout>
        </div>
    );
}
