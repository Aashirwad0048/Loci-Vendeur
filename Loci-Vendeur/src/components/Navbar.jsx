import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Removed useNavigate
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const role = currentUser?.role;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
   <nav className="navbar">
  <div className="nav-container">
    
    <h1 className="nav-logo">Loci-Vendeur</h1>

    <ul className={`nav-links ${isOpen ? "active" : ""}`}>

      {role === "retailer" && (
        <>
          <li className="nav-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/products">Inventory</Link>
          </li>
          <li className="nav-item">
            <Link to="/billing">Billing</Link>
          </li>
          <li className="nav-item">
            <Link to="/history">History</Link>
          </li>
           <li className="nav-item">
            <Link to="/profile">Profile</Link>
           </li>
        </>
      )}

      {role === "wholesaler" && (
        <>
          <li className="nav-item">
            <Link to="/wholesaler/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/orders">Orders</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/inventory">Supply Inventory</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/analytics">Analytics</Link>
          </li>
          <li className="nav-item">
            <Link to="/wholesaler/profile">Profile</Link>
          </li>
        </>
      )}

    {role === "admin" && (
  <>
    <li className="nav-item">
      <Link to="/admin">Overview</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/users">Users</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/orders">Orders</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/escrow">Escrow</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/inventory">Supply</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/disputes">Disputes</Link>
    </li>
    <li className="nav-item">
      <Link to="/admin/analytics">Insights</Link>
    </li>
  </>
)}

    </ul>

    <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
      <span className={`bar ${isOpen ? "open" : ""}`}></span>
      <span className={`bar ${isOpen ? "open" : ""}`}></span>
      <span className={`bar ${isOpen ? "open" : ""}`}></span>
    </div>

  </div>
</nav>

  );
}