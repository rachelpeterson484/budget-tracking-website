import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import "../styling/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <FaMoneyBillTrendUp className="header-icon"/>
        <h1 className="header-title">Budget Tracking</h1>
      </div>

      <nav className="header-nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/" className="nav-link">HOME</Link></li>
          <li className="nav-item"><Link to="/expenses" className="nav-link">EXPENSES</Link></li>
          <li className="nav-item"><Link to="/savings" className="nav-link">SAVINGS</Link></li>
          <li className="nav-item"><Link to="/debt" className="nav-link">DEBT</Link></li>
          <li className="nav-item"><Link to="/budget" className="nav-link">BUDGET</Link></li>
          <li className="nav-item"><Link to="/investments" className="nav-link">INVESTMENTS</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
