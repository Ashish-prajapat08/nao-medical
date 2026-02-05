import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomId" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
