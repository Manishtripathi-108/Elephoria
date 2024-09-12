import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideNav from './components/layout/sidenav/sidenav'
import TicTacToeClassic from './pages/games/tic-tac-toe/classic'
import TicTacToeAdvanced from './pages/games/tic-tac-toe/advanced'
import Shadows from './pages/ShadowsGrid'

function App() {
    return (
        <Router>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Routes>
                <Route path="/" element={<SideNav />} />
                <Route path="/shadows" element={<Shadows />} />

                {/* Tic-Tac-Toe Routes */}
                <Route path="/games/tic-tac-toe">
                    <Route index element={<TicTacToeClassic />} />
                    <Route path="classic" element={<TicTacToeClassic />} />
                    <Route path="advanced" element={<TicTacToeAdvanced />} />
                </Route>
            </Routes>
            {/* </Suspense> */}
        </Router>
    )
}

export default App
