import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Modal from '@/Components/Modal';
import { toast } from 'react-hot-toast';

export default function Reservations({ reservations }) {
    const [filteredReservations, setFilteredReservations] = useState(reservations.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [actionType, setActionType] = useState(null); // 'accept' or 'reject'

    const { patch, delete: destroy } = useForm();

    useEffect(() => {
        let result = reservations.data;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(res => 
                res.user?.name?.toLowerCase().includes(term) || 
                res.user?.email?.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(res => res.status === statusFilter);
        }

        setFilteredReservations(result);
    }, [searchTerm, statusFilter, reservations.data]);

    // Format date in a readable way
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    };

    // Get status badge style based on status
    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        
        switch (status) {
            case 'confirmed':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'cancelled':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text('Reservations Report', 14, 15);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

        // Prepare table data
        const tableData = filteredReservations.map(res => [
            res.id,
            res.user?.name || 'N/A',
            res.user?.email || 'N/A',
            formatDate(res.date),
            res.status
        ]);

        // Add table using autoTable
        autoTable(doc, {
            head: [['ID', 'Customer', 'Email', 'Reservation Date', 'Status']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            styles: { 
                fontSize: 8,
                cellPadding: 2,
                overflow: 'linebreak'
            },
            headStyles: { 
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 20 }, // ID
                1: { cellWidth: 40 }, // Customer
                2: { cellWidth: 50 }, // Email
                3: { cellWidth: 40 }, // Reservation Date
                4: { cellWidth: 25 }  // Status
            },
            margin: { top: 30 }
        });

        // Save the PDF
        doc.save('reservations-report.pdf');
    };

    const exportToExcel = () => {
        // Prepare data for Excel
        const data = filteredReservations.map(res => ({
            'ID': res.id,
            'Customer': res.user?.name || 'N/A',
            'Email': res.user?.email || 'N/A',
            'Reservation Date': formatDate(res.date),
            'Status': res.status
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reservations');

        // Save the Excel file
        XLSX.writeFile(wb, 'reservations-report.xlsx');
    };

    const handleViewDetails = (reservation) => {
        setSelectedReservation(reservation);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setSelectedReservation(null);
        setShowDetailsModal(false);
    };
    const handleDelete = (reservationId) => {
        if (confirm('Are you sure you want to delete this reservation?')) {
            destroy(route('admin.reservations.destroy', reservationId), {
                preserveScroll: true,
                onSuccess: () => {
                    setFilteredReservations(prevReservations => 
                        prevReservations.filter(res => res.id !== reservationId)
                    );
                    toast.success('Reservation deleted successfully');
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                    toast.error('Failed to delete reservation');
                }
            });
        }
    };
    const handleStatusUpdate = (reservationId, newStatus) => {
        console.log('Starting status update for reservation:', reservationId);
        console.log('New status:', newStatus);
        
        const data = {
            status: newStatus
        };
        
        const routeName = 'admin.reservations.update-status';
        console.log('Sending data:', data);
        console.log('Route:', route(routeName, reservationId));
        
        patch(route(routeName, reservationId), data, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Status update successful');
                setFilteredReservations(prevReservations => {
                    const updatedReservations = prevReservations.map(res => 
                        res.id === reservationId 
                            ? { ...res, status: newStatus }
                            : res
                    );
                    console.log('Updated reservations:', updatedReservations);
                    return updatedReservations;
                });
                toast.success(`Reservation ${newStatus} successfully`);
            },
            onError: (errors) => {
                console.error('Status update failed:', errors);
                toast.error(errors.message || 'Failed to update reservation status');
            }
        });
    };
    const openConfirmModal = (reservation, action) => {
        setSelectedReservation(reservation);
        setActionType(action);
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setActionType(null);
        setSelectedReservation(null);
    };

    return (
        <AdminLayout>
            <Head title="Reservations Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Reservations Management</h1>
                        <div className="flex space-x-3">
                            <button
                                onClick={exportToPDF}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Export PDF
                            </button>
                            <button
                                onClick={exportToExcel}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Reservations Table */}
                    <div className="mt-4 flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredReservations.length > 0 ? (
                                                filteredReservations.map((reservation) => (
                                                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{reservation.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    {reservation.user && reservation.user.image ? (
                                                                        <img 
                                                                            className="h-10 w-10 rounded-full object-cover border-2 border-orange-100" 
                                                                            src={reservation.user.image} 
                                                                            alt={reservation.user.name} 
                                                                        />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                                                                            {reservation.user?.name.charAt(0).toUpperCase() || 'N/A'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{reservation.user?.name || 'N/A'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.user?.email || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(reservation.date)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={getStatusBadge(reservation.status)}>
                                                                {reservation.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                {/* Accept Button */}
                                                                {reservation.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                                                        className="text-green-600 hover:text-green-900"
                                                                        title="Accept Reservation"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                                
                                                                {/* Reject Button */}
                                                                {reservation.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title="Reject Reservation"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                )}

                                                                {/* View Details Button */}
                                                                <button
                                                                    onClick={() => handleViewDetails(reservation)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="View Details"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </button>

                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => handleDelete(reservation.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Delete Reservation"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                                            </svg>
                                                            <p className="text-lg font-medium">No reservations found</p>
                                                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">
                            {actionType === 'accept' ? 'Accept' : 'Reject'} Reservation
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to {actionType === 'accept' ? 'accept' : 'reject'} this reservation?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    const data = {
                                        status: actionType === 'accept' ? 'confirmed' : 'cancelled'
                                    };
                                    
                                    console.log('Sending data:', data);
                                    console.log('Sending request to:', route('admin.reservations.update-status', selectedReservation.id));
                                    
                                    patch(route('admin.reservations.update-status', selectedReservation.id), data, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            console.log('Status update successful');
                                            setFilteredReservations(prevReservations => {
                                                const updatedReservations = prevReservations.map(res => 
                                                    res.id === selectedReservation.id 
                                                        ? { ...res, status: actionType === 'accept' ? 'confirmed' : 'cancelled' }
                                                        : res
                                                );
                                                console.log('Updated reservations:', updatedReservations);
                                                return updatedReservations;
                                            });
                                            toast.success(`Reservation ${actionType === 'accept' ? 'confirmed' : 'cancelled'} successfully`);
                                            closeConfirmModal();
                                        },
                                        onError: (errors) => {
                                            console.error('Status update failed:', errors);
                                            toast.error(errors.message || 'Failed to update reservation status');
                                        }
                                    });
                                }}
                                className={`px-4 py-2 rounded-md text-white ${
                                    actionType === 'accept' 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {actionType === 'accept' ? 'Accept' : 'Reject'}
                            </button>
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            <Modal show={showDetailsModal} onClose={closeDetailsModal}>
                {selectedReservation && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Reservation Details</h3>
                            <button
                                onClick={closeDetailsModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Customer Information</h4>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {selectedReservation.user?.image ? (
                                            <img
                                                className="h-12 w-12 rounded-full object-cover border-2 border-orange-100"
                                                src={selectedReservation.user.image}
                                                alt={selectedReservation.user.name}
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                                                {selectedReservation.user?.name.charAt(0).toUpperCase() || 'N/A'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedReservation.user?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{selectedReservation.user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reservation Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Reservation Details</h4>
                                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Reservation ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900">#{selectedReservation.id}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            <span className={getStatusBadge(selectedReservation.status)}>
                                                {selectedReservation.status}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedReservation.date)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedReservation.created_at)}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h4>
                                <dl className="grid grid-cols-1 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {selectedReservation.notes || 'No additional notes'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                {selectedReservation.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleStatusUpdate(selectedReservation.id, 'confirmed');
                                                closeDetailsModal();
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Accept Reservation
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleStatusUpdate(selectedReservation.id, 'cancelled');
                                                closeDetailsModal();
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Reject Reservation
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        handleDelete(selectedReservation.id);
                                        closeDetailsModal();
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete Reservation
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
} 