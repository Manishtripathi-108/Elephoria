import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideNav from './components/layout/sidenav/sidenav'
import TicTacToe from './pages/games/tic_tac_toe'
import Shadows from './pages/ShadowsGrid'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SideNav />} />
                <Route path="/shadows" element={<Shadows />} />
                <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
            </Routes>
        </Router>
    )
}

export default App
