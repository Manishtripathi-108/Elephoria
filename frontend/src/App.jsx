import React, { Suspense, lazy } from 'react'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import SideNav from './components/layout/sidenav/sidenav'
import NotFound from './pages/404-page'
import Shadows from './pages/ShadowsGrid'
import AuthPage from './pages/auth/AuthState'
import TicTacToeClassic from './pages/games/tic-tac-toe/classic'
import TicTacToeUltimate from './pages/games/tic-tac-toe/ultimate'

function App() {
    return (
        <Router>
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

                <Route path="/" element={<SideNav />} />
                <Route path="/shadows" element={<Shadows />} />
                <Route path="/auth" element={<AuthPage />} />

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
        </Router>
    )
}

export default App
