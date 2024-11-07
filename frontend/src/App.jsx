import React, { Suspense, lazy } from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import RootLayout from './components/layout/RootLayout'
import { AnimeHubProvider } from './context/AnimeHubContext'
import { LoadingBarProvider } from './context/LoadingBarContext'

// Lazy-loaded components
const NotFound = lazy(() => import('./pages/404-page'))
const Shadows = lazy(() => import('./pages/ShadowsGrid'))
const AnimeHub = lazy(() => import('./pages/animeHub/AnimeHub'))
const AnimeHubAuth = lazy(() => import('./pages/animeHub/AnimeHubAuth'))
const MusicEditor = lazy(() => import('./pages/audio/AudioEditor'))
const TicTacToeClassic = lazy(() => import('./pages/games/tic-tac-toe/classic'))
const TicTacToeUltimate = lazy(() => import('./pages/games/tic-tac-toe/ultimate'))
const TicTacToe = lazy(() => import('./pages/games/tic-tac-toe/TicTacToe'))

// Fallback component for Suspense
const Loading = () => <div>Loading...</div>

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Shadows />
                    </Suspense>
                ),
            },
            {
                path: '/shadows',
                element: (
                    <Suspense fallback={<Loading />}>
                        <Shadows />
                    </Suspense>
                ),
            },
            {
                path: '/audio',
                element: (
                    <Suspense fallback={<Loading />}>
                        <MusicEditor />
                    </Suspense>
                ),
            },
            {
                path: '/anime-hub',
                children: [
                    {
                        index: true,
                        element: (
                            <AnimeHubProvider>
                                <Suspense fallback={<Loading />}>
                                    <AnimeHub />
                                </Suspense>
                            </AnimeHubProvider>
                        ),
                    },
                    {
                        path: 'auth',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <AnimeHubAuth />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: '/games/tic-tac-toe',
                element: (
                    <Suspense fallback={<Loading />}>
                        <TicTacToe />
                    </Suspense>
                ),
                children: [
                    {
                        path: 'classic',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <TicTacToeClassic />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'ultimate',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <TicTacToeUltimate />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<Loading />}>
                        <NotFound />
                    </Suspense>
                ),
            },
        ],
    },
])

function App() {
    return (
        <LoadingBarProvider>
            <RouterProvider router={router} />
        </LoadingBarProvider>
    )
}

export default App
