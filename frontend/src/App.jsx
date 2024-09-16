import React, { Suspense, lazy } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import SideNav from './components/layout/sidenav/sidenav'
import Shadows from './pages/ShadowsGrid'
import Login from './pages/auth/login'
import TicTacToeClassic from './pages/games/tic-tac-toe/classic'
import TicTacToeUltimate from './pages/games/tic-tac-toe/ultimate'

function App() {
    return (
        <Router>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
                <Route path="/" element={<SideNav />} />
                <Route path="/shadows" element={<Shadows />} />
                <Route path="/login" element={<Login />} />

                {/* Tic-Tac-Toe Routes */}
                <Route path="/games/tic-tac-toe">
                    <Route index element={<TicTacToeClassic />} />
                    <Route path="classic" element={<TicTacToeClassic />} />
                    <Route path="ultimate" element={<TicTacToeUltimate />} />
                </Route>
            </Routes>
            {/* </Suspense> */}
        </Router>
    )
}

export default App
