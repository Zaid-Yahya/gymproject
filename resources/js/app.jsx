import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { AnimatePresence } from 'framer-motion';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log('Inertia trying to resolve page:', name);
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AnimatePresence mode="wait" initial={false}>
                <App {...props} />
            </AnimatePresence>
        );
    },
    progress: {
        color: '#ef4444', // Using the red theme color
        delay: 250,
        includeCSS: true,
        showSpinner: true,
    },
});
