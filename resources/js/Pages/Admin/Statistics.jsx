import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Statistics({ auth }) {
    const [userRegistrations, setUserRegistrations] = useState({ labels: [], data: [] });
    const [subscriptionsByPlan, setSubscriptionsByPlan] = useState({ labels: [], data: [] });
    const [revenuePerMonth, setRevenuePerMonth] = useState({ labels: [], data: [] });
    const [userStatus, setUserStatus] = useState({ active: 0, inactive: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/statistics'); // Adjust URL if needed
                const data = await response.json();

                setUserRegistrations(data.userRegistrations);
                setSubscriptionsByPlan(data.subscriptionsByPlan);
                setRevenuePerMonth(data.revenuePerMonth);
                setUserStatus(data.userStatus);
            } catch (error) {
                console.error('Error fetching statistics data:', error);
            }
        };

        fetchData();
    }, []);

    const userRegistrationsChartData = {
        labels: userRegistrations?.labels || [],
        datasets: [
            {
                label: 'New Users',
                data: userRegistrations?.data || [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const subscriptionsByPlanChartData = {
        labels: subscriptionsByPlan?.labels || [],
        datasets: [
            {
                label: 'Subscriptions',
                data: subscriptionsByPlan?.data || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const revenuePerMonthChartData = {
        labels: revenuePerMonth?.labels || [],
        datasets: [
            {
                label: 'Revenue',
                data: revenuePerMonth?.data || [],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const activeInactiveUsersChartData = {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [
            {
                label: 'Users',
                data: [userStatus?.active || 0, userStatus?.inactive || 0],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    };

    return (
        <AdminLayout user={auth?.user} title="Application Statistics">
            <Head title="Statistics" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Application Statistics Overview</h3>
                        
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <h4 className="font-medium text-gray-700 mb-4">User Registrations Over Time</h4>
                                <Bar options={chartOptions} data={userRegistrationsChartData} />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <h4 className="font-medium text-gray-700 mb-4">Subscriptions by Plan</h4>
                                <Bar options={chartOptions} data={subscriptionsByPlanChartData} />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <h4 className="font-medium text-gray-700 mb-4">Revenue per Month</h4>
                                <Bar options={chartOptions} data={revenuePerMonthChartData} />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <h4 className="font-medium text-gray-700 mb-4">Active vs. Inactive Users</h4>
                                <Doughnut options={chartOptions} data={activeInactiveUsersChartData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}