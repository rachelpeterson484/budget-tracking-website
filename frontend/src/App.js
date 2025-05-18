import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Expenses from './subpages/Expenses';
import Header from './components/Header';
import Budget from './subpages/Budget';
import Investments from './subpages/Investments';
import Debt from './subpages/Debt';
import Savings from './subpages/Savings';

// Get the base URL from environment variable or default to empty string
const basename = process.env.PUBLIC_URL || '';

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Budget Tracker</h1>
      <p>Track your expenses and manage your budget effectively</p>
      <div className="features">
        <div className="feature">
          <h3>Track Expenses</h3>
          <p>Record and categorize your daily expenses</p>
        </div>
        <div className="feature">
          <h3>Budget Planning</h3>
          <p>Set and monitor your budget goals</p>
        </div>
        <div className="feature">
          <h3>Reports</h3>
          <p>View detailed reports and analytics</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename={basename}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/debt" element={<Debt />} />
            <Route path="/savings" element={<Savings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
