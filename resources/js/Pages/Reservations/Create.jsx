import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar } from '@/Components/ui/calendar';
import { Button } from '@/Components/ui/button';
import { Toaster, toast } from 'react-hot-toast';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        date: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => {
                toast.success('Session reserved successfully! Check your email for confirmation.');
            },
            onError: () => {
                toast.error('Failed to reserve session. Please try again.');
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reserve Session" />
            <Toaster position="top-right" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">Reserve Your Training Session</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date
                                    </label>
                                    <Calendar
                                        mode="single"
                                        selected={data.date}
                                        onSelect={(date) => setData('date', date)}
                                        className="rounded-md border"
                                        disabled={(date) => date < new Date()}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !data.date}
                                    className="w-full bg-orange-600 hover:bg-orange-700"
                                >
                                    {processing ? 'Reserving...' : 'Reserve Session'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 