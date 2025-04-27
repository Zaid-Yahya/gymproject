import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ members, workouts, payments, report, totalRevenue, revenueChange, activeMembers, newMembers }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="font-extrabold text-2xl text-blue-900">GymMaster</span>
                    <Link href="/" className="text-blue-600 hover:underline">Home</Link>
                    <Link href="/members" className="text-gray-700 hover:underline">Members</Link>
                    <Link href="/workouts" className="text-gray-700 hover:underline">Workouts</Link>
                    <Link href="/payments" className="text-gray-700 hover:underline">Payments</Link>
                    <Link href="/reports" className="text-gray-700 hover:underline">Reports</Link>
                    <Link href="/settings" className="text-gray-700 hover:underline">Settings</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">JS</div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member Management */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Member Management</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><span className="mr-2">👤</span>Add Member</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((m, i) => (
                                <tr key={i} className="border-t">
                                    <td>{m.name}</td>
                                    <td>{m.email}</td>
                                    <td>{m.type}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${m.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{m.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Workout Tracker */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Workout Tracker</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><span className="mr-2">🏋️</span>Add Workout</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th>Member</th>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workouts.map((w, i) => (
                                <tr key={i} className="border-t">
                                    <td>{w.member}</td>
                                    <td>{w.type}</td>
                                    <td>{w.duration}</td>
                                    <td>{w.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payment Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Payment Overview</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><span className="mr-2">💳</span>Add Payment</button>
                    </div>
                    <div className="flex space-x-8 mb-4">
                        <div>
                            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                            <div className="text-green-500 text-sm">+{revenueChange}% from last month</div>
                            <div className="text-gray-500 text-xs mt-1">Total Revenue</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{activeMembers}</div>
                            <div className="text-green-500 text-sm">+{newMembers} new this month</div>
                            <div className="text-gray-500 text-xs mt-1">Active Members</div>
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th>Member</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, i) => (
                                <tr key={i} className="border-t">
                                    <td>{p.member}</td>
                                    <td>${p.amount.toFixed(2)}</td>
                                    <td>{p.date}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{p.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Reports */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Reports</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><span className="mr-2">📄</span>Generate Report</button>
                    </div>
                    <div className="mb-4">
                        <select className="border rounded px-2 py-1 text-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>This year</option>
                        </select>
                    </div>
                    {/* Simple chart using SVG */}
                    <svg viewBox="0 0 300 100" className="w-full h-32">
                        <polyline
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            points={report.data.map((d, i) => `${i * 60},${100 - d / 100}`).join(' ')}
                        />
                        {report.data.map((d, i) => (
                            <circle key={i} cx={i * 60} cy={100 - d / 100} r="3" fill="#2563eb" />
                        ))}
                        {/* X-axis labels */}
                        {report.labels.map((label, i) => (
                            <text key={i} x={i * 60} y="98" fontSize="10" textAnchor="middle">{label}</text>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-400 text-xs py-4 border-t mt-8">
                GymMaster © 2024 &nbsp; | &nbsp;
                <Link href="#" className="hover:underline">Privacy Policy</Link> &nbsp; | &nbsp;
                <Link href="#" className="hover:underline">Terms of Service</Link>
            </footer>
        </div>
    );
} 