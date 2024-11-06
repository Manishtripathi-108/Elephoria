import React from 'react'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import RootLayout from './components/layout/RootLayout'
import { AnimeHubProvider } from './context/AnimeHubContext'
import NotFound from './pages/404-page'
import Shadows from './pages/ShadowsGrid'
import AnimeHub from './pages/animeHub/AnimeHub'
import AnimeHubAuth from './pages/animeHub/AnimeHubAuth'
import MusicEditor from './pages/audio/AudioEditor'
// import AuthPage from './pages/auth/AuthState'
import TicTacToeClassic from './pages/games/tic-tac-toe/classic'
import TicTacToeUltimate from './pages/games/tic-tac-toe/ultimate'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: '/', element: <Shadows /> },
            { path: '/shadows', element: <Shadows /> },
            { path: '/audio', element: <MusicEditor /> },
            {
                path: '/anime-hub',
                children: [
                    {
                        index: true,
                        element: (
                            <AnimeHubProvider>
                                <AnimeHub />
                            </AnimeHubProvider>
                        ),
                    },
                    { path: 'auth', element: <AnimeHubAuth /> },
                ],
            },
            {
                path: '/games/tic-tac-toe',
                children: [
                    { index: true, element: <TicTacToeClassic /> },
                    { path: 'classic', element: <TicTacToeClassic /> },
                    { path: 'ultimate', element: <TicTacToeUltimate /> },
                ],
            },
            { path: '*', element: <NotFound /> },
        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
