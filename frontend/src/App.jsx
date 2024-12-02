import React, { Suspense, lazy } from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import RootLayout from './components/layout/RootLayout'
import { AnimeHubProvider } from './context/AnimeHubContext'
import { LoadingBarProvider } from './context/LoadingBarContext'
import { TicTacToeProvider } from './context/TicTacToe/TicTacToeContext'
import './utils/iconUtils'

console.log(import.meta.env.VITE_SERVER_URL)

// Lazy-loaded components
const NotFound = lazy(() => import('./pages/404-page'))
const Shadows = lazy(() => import('./pages/ShadowsGrid'))
const AnimeHub = lazy(() => import('./pages/animeHub/AnimeHub'))
const AnimeHubAuth = lazy(() => import('./pages/animeHub/AnimeHubAuth'))
const MusicEditor = lazy(() => import('./pages/audio/AudioEditor'))
const TicTacToe = lazy(() => import('./pages/games/tic-tac-toe/TicTacToe'))
const ClassicTicTacToe = lazy(() => import('./pages/games/tic-tac-toe/ClassicTicTacToe'))
const UltimateTicTacToe = lazy(() => import('./pages/games/tic-tac-toe/UltimateTicTacToe'))

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
                            <AnimeHubProvider>
                                <Suspense fallback={<Loading />}>
                                    <AnimeHubAuth />
                                </Suspense>
                            </AnimeHubProvider>
                        ),
                    },
                ],
            },
            {
                path: '/games/tic-tac-toe',
                element: (
                    <TicTacToeProvider>
                        <Suspense fallback={<Loading />}>
                            <TicTacToe />
                        </Suspense>
                    </TicTacToeProvider>
                ),
                children: [
                    {
                        path: '/games/tic-tac-toe',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ClassicTicTacToe />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'classic',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ClassicTicTacToe />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'ultimate',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <UltimateTicTacToe />
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
