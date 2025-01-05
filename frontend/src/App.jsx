import React, { Suspense, lazy } from 'react'

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import LoadingState from './components/Loading'
import ProtectedRoute from './components/PrivateRoute'
import RootLayout from './components/layout/RootLayout'
import { AnimeHubProvider } from './context/AnimeHubContext'
import AuthTokenProvider from './context/AuthTokenProvider'
import { LoadingBarProvider } from './context/LoadingBarContext'
import { TicTacToeProvider } from './context/TicTacToe/TicTacToeContext'
import './utils/iconUtils'

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/404-page'))
const Shadows = lazy(() => import('./pages/ShadowsGrid'))
const AnimeLayout = lazy(() => import('./pages/anime/AnimeLayout'))
const AnimeList = lazy(() => import('./pages/anime/AnimeList'))
const AnimeLogin = lazy(() => import('./pages/anime/AnimeLogin'))
const AnimeHub = lazy(() => import('./pages/animeHub/AnimeHub'))
const AnimeHubAuth = lazy(() => import('./pages/animeHub/AnimeHubAuth'))
const AudioMetaExtractor = lazy(() => import('./pages/audio/AudioMetaExtractor'))
const AudioMetadataEditor = lazy(() => import('./pages/audio/AudioMetaEditor'))
const TicTacToe = lazy(() => import('./pages/games/tic-tac-toe/TicTacToe'))
const ClassicTicTacToe = lazy(() => import('./pages/games/tic-tac-toe/ClassicTicTacToe'))
const UltimateTicTacToe = lazy(() => import('./pages/games/tic-tac-toe/UltimateTicTacToe'))

// Reusable Suspense Wrapper
const withSuspense = (Component, props = {}) => (
    <Suspense fallback={<LoadingState {...props} />}>
        <Component />
    </Suspense>
)

const withProtectedRoute = (Component, isAnilistRoute = false) => <ProtectedRoute isAnilistRoute={isAnilistRoute}>{Component}</ProtectedRoute>

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthTokenProvider>
                <RootLayout />
            </AuthTokenProvider>
        ),
        children: [
            { index: true, element: withSuspense(Home) },
            { path: '/shadows', element: withSuspense(Shadows) },
            /* -------------------------------------------------------------------------- */
            /*                                    Audio                                   */
            /* -------------------------------------------------------------------------- */
            { path: '/audio/tags-extractor', element: withSuspense(AudioMetaExtractor) },
            { path: '/audio/tags-editor', element: withSuspense(AudioMetadataEditor) },
            /* -------------------------------------------------------------------------- */
            /*                                  Anime Hub                                 */
            /* -------------------------------------------------------------------------- */
            {
                path: '/anime-hub',
                element: <AnimeHubProvider>{withSuspense(AnimeHub)}</AnimeHubProvider>,
            },
            {
                path: '/anime-hub/auth',
                element: <AnimeHubProvider>{withSuspense(AnimeHubAuth)}</AnimeHubProvider>,
            },
            /* -------------------------------------------------------------------------- */
            /*                                    Anime                                   */
            /* -------------------------------------------------------------------------- */
            {
                path: '/anime',
                element: withProtectedRoute(withSuspense(AnimeLayout), true),
                children: [
                    { index: true, element: <Navigate to="animelist" replace /> },
                    { path: 'animelist', element: withSuspense(AnimeList) },
                ],
            },
            { path: '/anime/login', element: withSuspense(AnimeLogin) },
            /* -------------------------------------------------------------------------- */
            /*                                    Games                                   */
            /* -------------------------------------------------------------------------- */
            {
                path: '/games/tic-tac-toe',
                element: <TicTacToeProvider>{withSuspense(TicTacToe)}</TicTacToeProvider>,
                children: [
                    { index: true, element: <Navigate to="classic" replace /> },
                    {
                        path: 'classic',
                        element: withSuspense(ClassicTicTacToe, { circleSize: '20px', width: 'w-60 sm:w-96', height: 'h-60 sm:h-96' }),
                    },
                    {
                        path: 'ultimate',
                        element: withSuspense(UltimateTicTacToe, { circleSize: '20px', width: 'w-60 sm:w-96', height: 'h-60 sm:h-96' }),
                    },
                ],
            },
            { path: '*', element: withSuspense(NotFound) },
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
