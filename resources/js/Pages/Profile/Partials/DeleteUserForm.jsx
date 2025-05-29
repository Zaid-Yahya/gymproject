import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className={className}>
            <div className="border-b border-gray-200">
                <div className="px-6 py-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Supprimer le compte
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Une fois votre compte supprimé, toutes ses ressources et données seront définitivement effacées.
                    </p>
                </div>
            </div>

            <div className="p-6">
                <div className="p-4 bg-red-50 border border-red-100 rounded-md mb-6">
                    <div className="flex">
                        <svg className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-red-800">
                                Cette action est définitive
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>
                                    Avant de supprimer votre compte, veuillez télécharger toutes les données ou informations que vous souhaitez conserver. Cette action ne peut pas être annulée.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={confirmUserDeletion}
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer le compte
                </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            {confirmingUserDeletion && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
                        onClick={closeModal}
                        aria-hidden="true"
                    ></div>
                    
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                Supprimer le compte
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Êtes-vous sûr de vouloir supprimer votre compte? Toutes vos données seront définitivement supprimées. Cette action ne peut pas être annulée.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <form 
                                    onSubmit={deleteUser} 
                                    className="bg-gray-50 px-4 py-3 sm:flex sm:flex-col gap-3 sm:px-6"
                                >
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Mot de passe
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                ref={passwordInput}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 sm:text-sm"
                                                placeholder="Confirmez avec votre mot de passe"
                                                autoFocus
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
                                        >
                                            {processing ? 'Suppression...' : 'Confirmer la suppression'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
