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
import {fetchRemindersData, fetchRemindersDataUser} from "@/utils/dataFetchFunctions";
import {Badge, Calendar} from "antd";
import type {BadgeProps, CalendarProps} from "antd";
import type {Dayjs} from "dayjs";
import StatCard from "@/components/StatCard";
import {BsBriefcaseFill, BsFileEarmarkText, BsPerson} from "react-icons/bs";
import PieChartCard from "@/components/PieChartCard";
import RemindersCalendar from "@/components/RemindersCalendar";
import NearlyExpiredDocuments from "@/components/NearlyExpiredDocuments";
import {getWithAuth} from "@/utils/apiClient";
import {useUserContext} from "@/context/userContext";
import AssignedFiles from "@/components/AssignedFiles";
import MySector from "@/components/MySector";


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


interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}

interface AdminDashboardData {
    total_users: number;
    total_documents: number;
    total_categories: number;
    total_sectors: number;
    documents_by_category: {
        category_name: string;
        percentage: number;
    }[];
    documents_by_sector: {
        sector_name: string;
        percentage: number;
    }[];
}


export interface UserDashboardData {
    sector_name: string;
    sector_user_count: number;
    sector_document_count: number;
    assigned_documents_count: number;
    recently_assigned_count: number;
    due_this_week_count: number;
    overdue_count: number;
    assigned_documents: AssignedDocument[];
    category_distribution: {
        category_name: string;
        percentage: number;
    }[];
}

export interface AssignedDocument {
    id: number;
    document_name: string;
    category_name: string;
    expiration_date: string | null;
    is_new: number;
    days_since_added: number;
}


const generateRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

export default function Home() {
    const isAuthenticated = useAuth();

    const {userId} = useUserContext();
    const [isAdmin, setIsAdmin] = useState<number>();

    // const [selectedDates, setSelectedDates] = useState<{ date: string; content: string; type: BadgeProps["status"] }[]>([
    //   { date: "2024-12-15", content: "Meeting with client", type: "success" },
    //   { date: "2024-12-08", content: "Project deadline", type: "warning" },
    //   { date: "2024-12-10", content: "Code review session", type: "error" },
    // ]);

    const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | UserDashboardData | null>(null);
    const [categoryChartData, setCategoryChartData] = useState<ChartDataItem[]>([]);
    const [sectorChartData, setSectorChartData] = useState<ChartDataItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // const fetchDashboardData = async () => {
    //     try {
    //         const response = await getWithAuth("admin-dashboard-data");
    //         console.log("------------fetched data: ", response);
    //         setFetchData(response);
    //     } catch (error) {
    //         console.error("Failed to fetch data:", error);
    //     }
    // };
    //
    // console.log("----------- : ", fetchData)


    // useEffect(() => {
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

    // fetchRemindersData((data) => {
    //     const transformedData = data
    //         .filter((reminder: { start_date_time: any; }) => reminder.start_date_time)
    //         .map((reminder: { start_date_time: any; subject: any; }) => ({
    //             date: reminder.start_date_time!.split(" ")[0],
    //             content: reminder.subject,
    //             type: "success",
    //         }));
    //     setSelectedDates(transformedData);
    // });
    //
    //     fetchDashboardData();
    // }, []);

    useEffect(() => {
        if (!userId) return;
        const fetchRoleData = async () => {
            try {
                const response = await getWithAuth(`user-permissions/${userId}`);
                setIsAdmin(response.is_admin);
            } catch (error) {
                console.error("Failed to fetch role data:", error);
                setIsAdmin(0);
            }
        };
        fetchRoleData();
    }, [userId]);

    console.log("---------is admin: ", isAdmin);

    // useEffect(() => {
    //     const fetchDashboardData = async () => {
    //         try {
    //             const response: AdminDashboardData = await getWithAuth(endpoint);
    //             setDashboardData(response);
    //
    //             console.log("----------response :", response);
    //
    //             if (response.documents_by_category) {
    //                 const transformedCategoryData = response.documents_by_category
    //                     .filter(item => item.percentage > 0)
    //                     .map(item => ({
    //                         name: item.category_name,
    //                         value: Math.round(item.percentage),
    //                         color: generateRandomColor(),
    //                     }));
    //                 setCategoryChartData(transformedCategoryData);
    //             }
    //
    //
    //             if (response.documents_by_sector) {
    //                 const transformedSectorData = response.documents_by_sector
    //                     .filter(item => item.percentage > 0) // Only include sectors with documents
    //                     .map(item => ({
    //                         name: item.sector_name,
    //                         value: Math.round(item.percentage),
    //                         color: generateRandomColor(),
    //                     }));
    //                 setSectorChartData(transformedSectorData);
    //             }
    //
    //         } catch (error) {
    //             console.error("Failed to fetch dashboard data:", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //
    //     if (isAuthenticated) {
    //         fetchDashboardData();
    //     }
    // }, [isAuthenticated]);


    useEffect(() => {
        if (typeof isAdmin === 'undefined') return;

        const endpoint = isAdmin === 1 ? "admin-dashboard-data" : "user-dashboard-data";

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const response = await getWithAuth(endpoint);
                setDashboardData(response);

                // --- 4. Handle transformations based on role ---
                if (isAdmin === 1) {
                    const data = response as AdminDashboardData;
                    if (data.documents_by_category) {
                        setCategoryChartData(data.documents_by_category.filter(item => item.percentage > 0).map(item => ({
                            name: item.category_name,
                            value: Math.round(item.percentage),
                            color: generateRandomColor()
                        })));
                    }
                    if (data.documents_by_sector) {
                        setSectorChartData(data.documents_by_sector.filter(item => item.percentage > 0).map(item => ({
                            name: item.sector_name,
                            value: Math.round(item.percentage),
                            color: generateRandomColor()
                        })));
                    }
                } else {
                    const data = response as UserDashboardData;
                    if (data.category_distribution) {
                        setCategoryChartData(data.category_distribution.filter(item => item.percentage > 0).map(item => ({
                            name: item.category_name,
                            value: Math.round(item.percentage),
                            color: generateRandomColor()
                        })));
                    }
                }

                const reminderCallback = (data: any[]) => {
                    const transformedData = data
                        .filter((reminder) => reminder.start_date_time)
                        .map((reminder) => ({
                            date: reminder.start_date_time!.split(" ")[0],
                            content: reminder.subject,
                            type: "success" as const,
                        }));
                    setSelectedDates(transformedData);
                };


                if (isAdmin === 1) {
                    fetchRemindersData(reminderCallback);
                } else {
                    fetchRemindersDataUser(reminderCallback);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchAllData();
        }
    }, [isAuthenticated, isAdmin]);


    // useEffect(() => {
    //     fetchRemindersDataUser((data) => {
    //         const transformedData = data
    //             .filter((reminder: { start_date_time: any; }) => reminder.start_date_time)
    //             .map((reminder: { start_date_time: any; subject: any; }) => ({
    //                 date: reminder.start_date_time!.split(" ")[0],
    //                 content: reminder.subject,
    //                 type: "success",
    //             }));
    //
    //         console.log("----------- reminders :", transformedData);
    //         setSelectedDates(transformedData);
    //     });
    // }, []);


    // useEffect(() => {
    //     // const transformRemindersToDates = (reminders: any[]) => {
    //     //   return reminders.map((reminder) => ({
    //     //     date: reminder.start_date_time.split(" ")[0],
    //     //     content: reminder.subject,
    //     //     type: "success" as const,
    //     //   }));
    //     // };
    //
    //     // fetchRemindersData((data: any[]) => {
    //     //   const transformedData = transformRemindersToDates(data);
    //     //   setSelectedDates(transformedData);
    //     // });
    //
    //     fetchRemindersDataUser((data) => {
    //         const transformedData = data
    //             .filter((reminder: { start_date_time: any; }) => reminder.start_date_time)
    //             .map((reminder: { start_date_time: any; subject: any; }) => ({
    //                 date: reminder.start_date_time!.split(" ")[0],
    //                 content: reminder.subject,
    //                 type: "success",
    //             }));
    //         setSelectedDates(transformedData);
    //     });
    // }, []);


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


    if (!isAuthenticated || isLoading) {
        return <LoadingSpinner/>;
    }

    const adminData = isAdmin === 1 ? (dashboardData as AdminDashboardData) : null;
    const userData = isAdmin === 0 ? (dashboardData as UserDashboardData) : null;


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
                        {isAdmin === 1 && adminData && (
                            <div className="d-flex flex-row align-items-center justify-content-between gap-1">
                                <StatCard title="Total Users" value={adminData?.total_users || 0}
                                          icon="/total_user.svg"
                                          changeText=""
                                          changeColorClass="positiveChange"/>
                                <StatCard title="Total Documents" value={adminData?.total_documents || 0}
                                          icon="/total_document.svg" changeText=""
                                          changeColorClass="positiveChange"/>
                                <StatCard title="Categories" value={adminData?.total_categories || 0}
                                          icon="/categories.svg" changeText=""
                                          changeColorClass="positiveChange"/>
                                <StatCard title="Sectors" value={adminData?.total_sectors || 0} icon="/sectors.svg"
                                          changeText=""
                                          changeColorClass="noChange"/>
                            </div>
                        )}

                        {isAdmin === 0 && userData && (
                            <div className="d-flex flex-row align-items-center justify-content-between gap-1">
                                <StatCard title="Assigned Files" value={userData?.assigned_documents_count || 0}
                                          icon="/total_document.svg" changeText="+12%"
                                          changeColorClass="positiveChange"/>
                                <StatCard title="Recently Assigned" value={userData?.recently_assigned_count || 0}
                                          icon="/recently_assigned.svg" changeText="+12%"
                                          changeColorClass="positiveChange"/>
                                <StatCard title="Due This Week" value={userData?.due_this_week_count || 0}
                                          icon="/due_this_week.svg" changeText="+12%"
                                          changeColorClass="positiveChange"/>
                                <StatCard title="Overdue" value={userData?.overdue_count || 0} icon="/warning.svg"
                                          changeText="+12%"
                                          changeColorClass="noChange"/>
                            </div>
                        )}


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

                    {isAdmin === 1 && (
                        <div className="py-4">
                            <div className="row g-4">
                                <div className="col-12 col-lg-6">
                                    <PieChartCard
                                        title="Documents by Category"
                                        icon="/jam_document.svg"
                                        data={categoryChartData}
                                    />
                                </div>

                                <div className="col-12 col-lg-6">
                                    <PieChartCard
                                        title="Documents by Sector"
                                        icon="/sector-line.svg"
                                        data={sectorChartData}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {isAdmin === 0 && userData && (
                        <div className="py-4">

                            <div className="row g-4">

                                <div className="col-12 col-lg-8">
                                    <AssignedFiles documents={userData.assigned_documents}/>
                                </div>

                                <div className="col-12 col-lg-4">
                                    <div className="d-flex flex-column gap-4">
                                        <MySector sectorName={userData.sector_name}
                                                  userCount={userData.sector_user_count}
                                                  documentCount={userData.sector_document_count}/>
                                        <PieChartCard title="My Documents by Category" icon="/jam_document.svg"
                                                      data={categoryChartData}/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}


                    <RemindersCalendar reminders={selectedDates}/>

                    <NearlyExpiredDocuments/>
                </div>
            </DashboardLayout>
        </div>
    );
}
