import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userDetails, logout } = useContext(AuthContext);

  // State to manage the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to get user initials from their name
  const getUserInitials = () => {
    if (userDetails?.name) {
      return userDetails?.name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("");
    }
    return "U"; // Default fallback initial
  };

  const menu = [
    { name: "Home", link: "/" },
    { name: "Top Rated", link: "/top-rated" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "https://yuvis-portfolio.vercel.app/" },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-3 md:px-8 flex items-center justify-between shadow-lg">
      {/* Logo Section */}
      <div className="text-lg flex flex-row items-center h-12 font-bold">
        <a href="/" className="hover:text-gray-300">
          <span className="text-4xl">🛋️</span> CouchPotatoes
        </a>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4">
        {menu.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="hover:text-gray-300 transition-colors"
          >
            {item.name}
          </a>
        ))}
      </nav>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {/* User Initials */}
            <div
              className="w-10 h-10 rounded-full bg-white text-gray-800 font-bold flex items-center justify-center cursor-pointer"
              title={userDetails?.name || "User"}
              onClick={() => navigate("/profile")}
            >
              {getUserInitials()}
            </div>
            {/* Logout Button */}
            <button
              onClick={logout}
              className="text-sm bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col items-center md:hidden">
          {menu.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="py-2 px-4 w-full text-center hover:bg-gray-700 transition-colors"
            >
              {item.name}
            </a>
          ))}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-full py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-2 bg-green-600 text-white text-sm hover:bg-green-700 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
