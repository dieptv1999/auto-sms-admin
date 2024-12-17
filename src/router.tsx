import {createBrowserRouter} from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'
import {ProtectedRoute} from "@/components/protect-route.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute/>,
        children: [
            // Main routes
            {
                path: '/',
                lazy: async () => {
                    const AppShell = await import('./components/app-shell')
                    return {Component: AppShell.default}
                },
                errorElement: <GeneralError/>,
                children: [
                    {
                        index: true,
                        lazy: async () => ({
                            Component: (await import('./pages/users')).default,
                        }),
                    },
                    {
                        // index: true,
                        path: 'users',
                        lazy: async () => ({
                            Component: (await import('@/pages/users')).default,
                        }),
                    },
                    {
                        path: 'user/:id',
                        lazy: async () => ({
                            Component: (await import('@/pages/user-activity')).default,
                        }),
                    },
                    {
                        path: 'user/log/:id',
                        lazy: async () => ({
                            Component: (await import('@/pages/user-logs')).default,
                        }),
                    },
                    {
                        path: 'analysis',
                        lazy: async () => ({
                            Component: (await import('@/pages/message-log')).default,
                        }),
                    },
                    {
                        path: 'settings',
                        lazy: async () => ({
                            Component: (await import('./pages/settings')).default,
                        }),
                        errorElement: <GeneralError/>,
                        children: [
                            {
                                index: true,
                                lazy: async () => ({
                                    Component: (await import('./pages/settings/profile')).default,
                                }),
                            },
                            {
                                path: 'account',
                                lazy: async () => ({
                                    Component: (await import('./pages/settings/account')).default,
                                }),
                            },
                        ],
                    },
                ],
            },
        ]
    },
    // Auth routes
    {
        path: '/sign-in',
        lazy: async () => ({
            Component: (await import('./pages/auth/sign-in-2')).default,
        }),
    },
    {
        path: '/forgot-password',
        lazy: async () => ({
            Component: (await import('./pages/auth/forgot-password')).default,
        }),
    },
    {
        path: '/otp',
        lazy: async () => ({
            Component: (await import('./pages/auth/otp')).default,
        }),
    },

    // Error routes
    {path: '/500', Component: GeneralError},
    {path: '/404', Component: NotFoundError},
    {path: '/503', Component: MaintenanceError},
    {path: '/401', Component: UnauthorisedError},

    // Fallback 404 route
    {path: '*', Component: NotFoundError},
])

export default router
