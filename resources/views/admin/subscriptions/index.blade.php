<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('User Subscriptions') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold">All Subscriptions</h3>
                        <a href="{{ route('admin.subscriptions.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add New Subscription
                        </a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subscription</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($userSubscriptions as $userSubscription)
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {{ $userSubscription->name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {{ $userSubscription->email }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {{ $userSubscription->phone_number ?? 'N/A' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {{ $userSubscription->subscription->name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {{ $userSubscription->start_date->format('Y-m-d') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {{ $userSubscription->end_date->format('Y-m-d') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            {{ $userSubscription->status === 'active' ? 'bg-green-100 text-green-800' : 
                                               ($userSubscription->status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800') }}">
                                            {{ ucfirst($userSubscription->status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            {{ $userSubscription->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                            {{ $userSubscription->is_active ? 'Yes' : 'No' }}
                                        </span>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-4">
                        {{ $userSubscriptions->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout> 