import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { format, differenceInDays } from 'date-fns';
import Modal from '@/Components/Modal'; // Assuming you have a Modal component in Components
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Subscriptions({ subscriptions }) {
  const [filteredSubscriptions, setFilteredSubscriptions] = useState(subscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const { delete: inertiaDelete } = useForm();

  useEffect(() => {
    let result = subscriptions;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sub => 
        sub.user?.name?.toLowerCase().includes(term) || 
        sub.user?.email?.toLowerCase().includes(term) ||
        sub.plan_name?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(sub => sub.status === statusFilter);
    }

    // Apply tier filter
    if (tierFilter !== 'all') {
      result = result.filter(sub => sub.tier.toString() === tierFilter);
    }

    setFilteredSubscriptions(result);
  }, [searchTerm, statusFilter, tierFilter, subscriptions]);

  // Format date in a readable way
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Get status badge style based on status
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'upgraded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Get tier badge style based on tier
  const getTierBadge = (tier) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (tier) {
      case 1:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 2:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 3:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Get period badge style
  const getPeriodBadge = (period) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (period) {
      case 'monthly':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'quarterly':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'yearly':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const openDetailsModal = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedSubscription(null);
    setShowDetailsModal(false);
  };

  const handleDelete = (subscriptionId) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      inertiaDelete(route('admin.subscriptions.destroy', subscriptionId), {
        onSuccess: () => {
          // Optionally, refresh the page or remove the item from the state
          // For simplicity, we'll let Inertia handle the redirect/refresh
        },
        onError: (errors) => {
          console.error('Error deleting subscription:', errors);
          alert('Failed to delete subscription.');
        },
      });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Subscriptions Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const tableData = filteredSubscriptions.map(sub => [
      sub.id,
      sub.user?.name || 'N/A',
      sub.user?.email || 'N/A',
      sub.subscription?.name || 'N/A',
      sub.status,
      formatDate(sub.start_date),
      formatDate(sub.end_date)
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [['ID', 'Customer', 'Email', 'Plan', 'Status', 'Start Date', 'End Date']],
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
        3: { cellWidth: 30 }, // Plan
        4: { cellWidth: 25 }, // Status
        5: { cellWidth: 30 }, // Start Date
        6: { cellWidth: 30 }  // End Date
      },
      margin: { top: 30 }
    });

    // Save the PDF
    doc.save('subscriptions-report.pdf');
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const data = filteredSubscriptions.map(sub => ({
      'ID': sub.id,
      'Customer': sub.user?.name || 'N/A',
      'Email': sub.user?.email || 'N/A',
      'Plan': sub.plan_name || 'N/A',
      'Status': sub.status,
      'Start Date': formatDate(sub.start_date),
      'End Date': formatDate(sub.end_date)
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Subscriptions');

    // Save the Excel file
    XLSX.writeFile(wb, 'subscriptions-report.xlsx');
  };

  return (
    <AdminLayout>
      <Head title="Subscriptions Management" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Subscriptions Management</h1>
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
              <Link
                href="/admin/subscriptions/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Subscription
              </Link>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        ${subscriptions.reduce((sum, sub) => sum + parseFloat(sub.price || 0), 0).toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {subscriptions.filter(sub => sub.status === 'active').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Expiring This Month</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {subscriptions.filter(sub => 
                          sub.status === 'active' && 
                          sub.days_remaining <= 30
                        ).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Subscription Value</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        ${subscriptions.length ? (subscriptions.reduce((sum, sub) => sum + parseFloat(sub.price || 0), 0) / subscriptions.length).toFixed(2) : '0.00'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="relative rounded-md shadow-sm max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by customer name, email or plan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="upgraded">Upgraded</option>
                </select>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                >
                  <option value="all">All Tiers</option>
                  <option value="1">Tier 1</option>
                  <option value="2">Tier 2</option>
                  <option value="3">Tier 3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="mt-4 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">All Subscriptions</h3>
                </div>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubscriptions.length > 0 ? (
                        filteredSubscriptions.map((subscription) => (
                          <tr key={subscription.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{subscription.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    {subscription.user && subscription.user.image ? (
                                        <img 
                                            className="h-10 w-10 rounded-full object-cover border-2 border-orange-100" 
                                            src={subscription.user.image} 
                                            alt={subscription.user.name} 
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                                            {subscription.user?.name.charAt(0).toUpperCase() || 'N/A'}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{subscription.user?.name || 'N/A'}</div>
                                  <div className="text-sm text-gray-500">{subscription.user?.email || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                           
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                subscription.plan_name === 'Basic' 
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                  : subscription.plan_name === 'Premium'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              }`}>
                                {subscription.plan_name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                subscription.period === 'monthly' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : subscription.period === 'quarterly'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-purple-100 text-purple-800 border border-purple-200'
                              }`}>
                                {subscription.period.charAt(0).toUpperCase() + subscription.period.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={getStatusBadge(subscription.status)}>{subscription.status}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(subscription.start_date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(subscription.end_date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                {/* Details Button */}
                                <button
                                  onClick={() => openDetailsModal(subscription)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View Details"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </button>
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDelete(subscription.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Subscription"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                              <p className="text-lg font-medium">No subscriptions found</p>
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

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details Modal */}
      <Modal show={showDetailsModal} onClose={closeDetailsModal} maxWidth="2xl">
        {selectedSubscription && (
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Subscription Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 text-gray-800">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Basic Information</h4>
                <p><strong className="font-medium text-gray-600">Subscription ID:</strong> <span className="font-mono text-indigo-700">#{selectedSubscription.id}</span></p>
                <p><strong className="font-medium text-gray-600">Plan:</strong> <span className="font-semibold text-orange-700">{selectedSubscription.plan_name}</span> ({selectedSubscription.period})</p>
                <p><strong className="font-medium text-gray-600">Tier:</strong> <span className="font-semibold">Tier {selectedSubscription.tier}</span></p>
                <p><strong className="font-medium text-gray-600">Price:</strong> <span className="text-green-600 font-bold">${parseFloat(selectedSubscription.price).toFixed(2)}</span></p>
                {selectedSubscription.original_price > selectedSubscription.price && (
                  <p><strong className="font-medium text-gray-600">Original Price:</strong> <span className="line-through text-gray-500">${parseFloat(selectedSubscription.original_price).toFixed(2)}</span></p>
                )}
                <p><strong className="font-medium text-gray-600">Status:</strong> <span className={getStatusBadge(selectedSubscription.status)}>{selectedSubscription.status}</span></p>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Customer & Dates</h4>
                <p><strong className="font-medium text-gray-600">Customer Name:</strong> {selectedSubscription.user?.name || 'N/A'}</p>
                <p><strong className="font-medium text-gray-600">Customer Email:</strong> {selectedSubscription.user?.email || 'N/A'}</p>
                <p><strong className="font-medium text-gray-600">Start Date:</strong> {formatDate(selectedSubscription.start_date)}</p>
                <p><strong className="font-medium text-gray-600">End Date:</strong> {formatDate(selectedSubscription.end_date)}</p>
                {selectedSubscription.discount && (
                  <p><strong className="font-medium text-gray-600">Discount:</strong> <span className="text-purple-700 font-semibold">{selectedSubscription.discount.code}</span> ({selectedSubscription.discount.type === 'percentage' ? `${selectedSubscription.discount.value}%` : `$${selectedSubscription.discount.value}`})</p>
                )}
              </div>
              <div className="lg:col-span-2 space-y-4 mt-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Usage & Expiry</h4>
                <p><strong className="font-medium text-gray-600">Days Remaining:</strong> <span className="text-blue-700 font-bold">{Math.floor(selectedSubscription.days_remaining)}</span> days</p>
                <p><strong className="font-medium text-gray-600">Days Used:</strong> {selectedSubscription.days_used} days</p>
                <p><strong className="font-medium text-gray-600">Percentage Used:</strong> <span className="font-bold">{selectedSubscription.percent_used}%</span></p>
                {selectedSubscription.is_expired && <p className="text-red-600 font-semibold mt-2">This subscription has expired.</p>}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
