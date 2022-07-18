import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoomAuthenticator from './RoomAuthenticator';
import Login from './Login';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Router>
        <Routes>
          <Route path="/room/:roomId" element={<RoomAuthenticator />}></Route>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
