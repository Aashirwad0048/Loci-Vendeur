import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const role = currentUser?.role;

  return (
   <nav key={location.pathname} className="navbar">
  <div className="nav-container">
    
    <h1 className="nav-logo">Loci-Vendeur</h1>

    <ul className={`nav-links ${isOpen ? "active" : ""}`}>

      {role === "retailer" && (
        <>
          <li className="nav-item">
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" onClick={() => setIsOpen(false)}>Inventory</Link>
          </li>
          <li className="nav-item">
            <Link to="/billing" onClick={() => setIsOpen(false)}>Billing</Link>
          </li>
          <li className="nav-item">
            <Link to="/history" onClick={() => setIsOpen(false)}>History</Link>
          </li>
           <li className="nav-item">
            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
           </li>
        </>
      )}

      {role === "wholesaler" && (
        <>
          <li className="nav-item">
            <Link to="/wholesaler/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/orders" onClick={() => setIsOpen(false)}>Orders</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/inventory" onClick={() => setIsOpen(false)}>Supply Inventory</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/analytics" onClick={() => setIsOpen(false)}>Analytics</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          </li>
        </>
      )}

    {role === "admin" && (
  <>
    <li className="nav-item">
      <Link to="/admin" onClick={() => setIsOpen(false)}>Overview</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/users" onClick={() => setIsOpen(false)}>Users</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/orders" onClick={() => setIsOpen(false)}>Orders</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/escrow" onClick={() => setIsOpen(false)}>Escrow</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/inventory" onClick={() => setIsOpen(false)}>Supply</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/disputes" onClick={() => setIsOpen(false)}>Disputes</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/analytics" onClick={() => setIsOpen(false)}>Insights</Link>
    </li>
  </>
)}

    </ul>

    <button type="button" className="nav-toggle" onClick={() => setIsOpen((open) => !open)} aria-label="Toggle navigation menu">
      <span className={`bar ${isOpen ? "open" : ""}`}></span>
      <span className={`bar ${isOpen ? "open" : ""}`}></span>
      <span className={`bar ${isOpen ? "open" : ""}`}></span>
    </button>

  </div>
</nav>

  );
}
