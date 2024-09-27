import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { to: "/korean-movies", label: "Korean Movies" },
    { to: "/chinese-movies", label: "Chinese Movies" },
    { to: "/japanese-movies", label: "Japanese Movies" },
    { to: "/thai-movies", label: "Thai Movies" },
    { to: "/korean-dramas", label: "Korean Dramas" },
    { to: "/chinese-dramas", label: "Chinese Dramas" },
    { to: "/japanese-dramas", label: "Japanese Dramas" },
    { to: "/thai-dramas", label: "Thai Dramas" },
  ];

  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            VOTOS
          </Link>
          <div className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-lg hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-2 text-lg hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
