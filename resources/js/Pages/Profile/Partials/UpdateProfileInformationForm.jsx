import { useForm, usePage, Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [preview, setPreview] = useState(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            image: null,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className={className}>
            <div className="border-b border-gray-200">
                <div className="px-6 py-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Informations du profil
                </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Mettez à jour vos informations personnelles et votre adresse email.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="p-6">
                {/* Profile Image */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo de profil
                    </label>
                    
                    <div className="flex items-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                            {preview ? (
                                <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : user.image ? (
                                <img 
                                    src={`/storage/${user.image}`} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                    <span className="text-2xl font-bold text-gray-300">
                                        {user.name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                )}
                            </div>
                            
                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <label className="w-full h-full flex items-center justify-center cursor-pointer">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleImageChange} 
                                        accept="image/*"
                                    />
                                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </label>
                            </div>
                        </div>
                        
                        <div className="ml-5">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <label className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer transition-all">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleImageChange} 
                                    accept="image/*"
                                />
                                Changer la photo
                            </label>
                                
                                {(preview || user.image) && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={() => {
                                            setData('image', null);
                                            setPreview(null);
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                JPG, PNG ou GIF. 2 MB maximum.
                            </p>
                        </div>
                    </div>
                    
                    {errors.image && (
                        <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                    </label>
                        <input
                            id="name"
                            type="text"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 sm:text-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                </div>

                {/* Email field */}
                <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                        <input
                            id="email"
                            type="email"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 sm:text-sm"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Email verification warning */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Votre adresse email n'est pas vérifiée.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="ml-1 underline text-sm text-yellow-600 hover:text-yellow-900 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        Cliquez ici pour envoyer un nouvel email de vérification.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <p className="mt-2 text-sm font-medium text-green-600">
                                        Un nouveau lien de vérification a été envoyé à votre adresse email.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-end">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="mr-3"
                    >
                        <p className="text-sm text-green-600 flex items-center">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Enregistré
                        </p>
                    </Transition>
                
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all"
                    >
                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
