import React, { Suspense, lazy } from 'react'

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import LoadingState from './components/Loading'
import ProtectedRoute from './components/PrivateRoute'
import RootLayout from './components/layout/RootLayout'
import { AnilistProvider } from './context/AnilistContext'
import { AuthTokenProvider } from './context/AuthTokenContext'
import { LoadingBarProvider } from './context/LoadingBarContext'
import { TicTacToeProvider } from './context/TicTacToe/TicTacToeContext'
import './utils/iconUtils'

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'))
const Page404 = lazy(() => import('./pages/Page404'))
const Shadows = lazy(() => import('./pages/ShadowsGrid'))
const Anilist = lazy(() => import('./pages/anilist/Anilist'))
const AnilistLogin = lazy(() => import('./pages/anilist/AnilistLogin'))
const AudioMetaExtractor = lazy(() => import('./pages/audio/AudioMetaExtractor'))
const SpotifyLogin = lazy(() => import('./pages/spotify/SpotifyLogin'))
const SpotifyRedirect = lazy(() => import('./pages/spotify/SpotifyRedirect'))
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
            { path: '/audio/tags-editor', element: withSuspense(AudioMetaExtractor) },
            /* -------------------------------------------------------------------------- */
            /*                                    Anilist                                 */
            /* -------------------------------------------------------------------------- */
            {
                path: '/anilist/:type',
                element: withProtectedRoute(<AnilistProvider>{withSuspense(Anilist)}</AnilistProvider>, true),
            },
            { path: '/anilist/login', element: withSuspense(AnilistLogin) },
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
            /* -------------------------------------------------------------------------- */
            /*                                   Spotify                                  */
            /* -------------------------------------------------------------------------- */
            { path: '/spotify/login', element: withSuspense(SpotifyLogin) },
            { path: '/spotify/login/redirect', element: withSuspense(SpotifyRedirect) },

            /* ----------------------------------- 404 ---------------------------------- */
            { path: '*', element: withSuspense(Page404) },
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
