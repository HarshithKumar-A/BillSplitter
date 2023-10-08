import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes

import Home from './components/Home';
import NewSplit from './components/NewSplit';
import ViewHistory from './components/ViewHistory';
import Summary from './components/Summary';
import Login from './components/Login';

function App() {
  return (
    <Router>
      {/* Use Routes as the parent element */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Use "element" prop */}
        <Route path="/new-split" element={<NewSplit />} />
        <Route path="/view-history" element={<ViewHistory />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes if needed */}
      </Routes>
    </Router>
  );
}

export default App;
