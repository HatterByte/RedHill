import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import trainLogo from "../assets/HomePageImages/booking-icon-1.png";

const NotFound = () => {
  // Easter egg: Show a random fun message
  const messages = [
    "Looks like this train took a wrong turn! 🚂",
    "Oops! You derailed the route.",
    "Lost in the railway maze?",
    "This track leads nowhere...",
    "You found a secret platform! 🧙‍♂️",
  ];
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];

  // Easter egg: Click logo for a surprise
  const [showEgg, setShowEgg] = React.useState(false);
  const handleLogoClick = () => setShowEgg(!showEgg);

  return (
    <div
      className="not-found-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
      }}
    >
      <img
        src={trainLogo}
        alt="Train Logo"
        style={{
          width: 120,
          marginBottom: 24,
          cursor: "pointer",
          filter: showEgg ? "hue-rotate(180deg)" : "none",
          transition: "filter 0.3s",
        }}
        onClick={handleLogoClick}
        title="Click me for a surprise!"
      />
      <h1
        style={{
          fontSize: "5rem",
          marginBottom: "1rem",
          color: "#e74c3c",
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        404
      </h1>
      <h2 style={{ marginBottom: "1rem", color: "#222", fontWeight: 700 }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: "2rem", color: "#555", fontSize: "1.2rem" }}>
        {randomMsg}
      </p>
      <Link
        to="/"
        style={{
          color: "#fff",
          background: "#3498db",
          padding: "0.75rem 2rem",
          borderRadius: 30,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "1.1rem",
          boxShadow: "0 2px 8px rgba(52,152,219,0.15)",
          transition: "background 0.2s",
        }}
      >
        Go to Home
      </Link>
      {showEgg && (
        <div
          style={{
            marginTop: 32,
            color: "#16a085",
            fontWeight: 700,
            fontSize: "1.3rem",
            animation: "fadeIn 1s",
          }}
        >
          🚂 You found the hidden train! All aboard the fun express! 🚂
        </div>
      )}
    </div>
  );
};

export default NotFound;
