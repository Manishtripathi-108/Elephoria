import React, { Suspense, lazy } from 'react'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import ToastStack from './components/common/notifications/ToastStack'
import Header from './components/layout/header'
import NotFound from './pages/404-page'
import Shadows from './pages/ShadowsGrid'
import AnimeHub from './pages/anime/AnimeHub'
import AnimeHubAuth from './pages/anime/AnimeHubAuth'
import MusicEditor from './pages/audio/AudioEditor'
// import AuthPage from './pages/auth/AuthState'
import TicTacToeClassic from './pages/games/tic-tac-toe/classic'
import TicTacToeUltimate from './pages/games/tic-tac-toe/ultimate'

function App() {
    return (
        <Router>
            {/* The Header will now appear on all pages */}
            <Header />

            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
                {/* Private Routes after proper set up of login */}
                {/* <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <SideNav />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/games/tic-tac-toe"
                    element={
                        <PrivateRoute>
                            <TicTacToeClassic />
                        </PrivateRoute>
                    }>
                    <Route path="classic" element={<TicTacToeClassic />} />
                    <Route path="ultimate" element={<TicTacToeUltimate />} />
                </Route> */}

                {/* Public Routes */}

                <Route path="/" element={<AnimeHub />} />
                <Route path="/shadows" element={<Shadows />} />
                {/* <Route path="/auth" element={<AuthPage />} /> */}
                <Route path="/audio" element={<MusicEditor />} />
                <Route path="/anime-hub">
                    <Route index element={<AnimeHub />} />
                    <Route path="auth" element={<AnimeHubAuth />} />
                </Route>

                {/* Tic-Tac-Toe Routes */}
                <Route path="/games/tic-tac-toe">
                    <Route index element={<TicTacToeClassic />} />
                    <Route path="classic" element={<TicTacToeClassic />} />
                    <Route path="ultimate" element={<TicTacToeUltimate />} />
                </Route>

                {/* Catch-all route for unknown URLs */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            {/* </Suspense> */}

            <ToastStack />
        </Router>
    )
}

export default App
