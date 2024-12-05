import React, { Suspense, lazy } from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import LoadingState from './components/Loading'
import PrivateRoute from './components/PrivateRoute'
import RootLayout from './components/layout/RootLayout'
import { AnimeHubProvider } from './context/AnimeHubContext'
import { LoadingBarProvider } from './context/LoadingBarContext'
import { TicTacToeProvider } from './context/TicTacToe/TicTacToeContext'
import './utils/iconUtils'

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/404-page'))
const Shadows = lazy(() => import('./pages/ShadowsGrid'))
const AnimeHub = lazy(() => import('./pages/animeHub/AnimeHub'))
const AnimeHubAuth = lazy(() => import('./pages/animeHub/AnimeHubAuth'))
const MusicEditor = lazy(() => import('./pages/audio/AudioEditor'))
const TicTacToe = lazy(() => import('./pages/games/tic-tac-toe/TicTacToe'))
const ClassicTicTacToe = lazy(() => import('./pages/games/tic-tac-toe/ClassicTicTacToe'))
const UltimateTicTacToe = lazy(() => import('./pages/games/tic-tac-toe/UltimateTicTacToe'))

// Fallback component for Suspense
// const Loading = () => <div>Loading...</div>

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: (
                    <Suspense fallback={<LoadingState />}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: '/shadows',
                element: (
                    <Suspense fallback={<LoadingState />}>
                        <Shadows />
                    </Suspense>
                ),
            },
            {
                path: '/audio',
                element: (
                    <Suspense fallback={<LoadingState />}>
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
                                <Suspense fallback={<LoadingState />}>
                                    <AnimeHub />
                                </Suspense>
                            </AnimeHubProvider>
                        ),
                    },
                    {
                        path: 'auth',
                        element: (
                            <AnimeHubProvider>
                                <Suspense fallback={<LoadingState />}>
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
                        <Suspense fallback={<LoadingState />}>
                            <TicTacToe />
                        </Suspense>
                    </TicTacToeProvider>
                ),
                children: [
                    {
                        path: '/games/tic-tac-toe',
                        element: (
                            <Suspense fallback={<LoadingState circleSize="20px" width="w-60 sm:w-96" height="h-60 sm:h-96" />}>
                                <ClassicTicTacToe />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'classic',
                        element: (
                            <Suspense fallback={<LoadingState circleSize="20px" width="w-60 sm:w-96" height="h-60 sm:h-96" />}>
                                <ClassicTicTacToe />
                            </Suspense>
                        ),
                    },
                    {
                        path: 'ultimate',
                        element: (
                            <Suspense fallback={<LoadingState circleSize="20px" width="w-60 sm:w-96" height="h-60 sm:h-96" />}>
                                <UltimateTicTacToe />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<LoadingState />}>
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
