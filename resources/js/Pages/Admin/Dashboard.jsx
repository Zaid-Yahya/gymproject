import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Welcome to the Admin Dashboard</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">Users</h4>
                                    <p className="text-blue-600">Manage user accounts</p>
                                </div>
                                
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-800">Subscriptions</h4>
                                    <p className="text-green-600">Manage subscriptions</p>
                                </div>
                                
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <h4 className="font-semibold text-purple-800">Payments</h4>
                                    <p className="text-purple-600">View payment history</p>
                                </div>
                                
                                <div className="bg-yellow-100 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-800">Discounts</h4>
                                    <p className="text-yellow-600">Manage discount codes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 