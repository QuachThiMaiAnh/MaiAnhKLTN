import React, { useState } from 'react';

function ResponsiveMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Menu Toggle Button */}
      <button onClick={toggleMenu} className="text-3xl p-4 fixed top-4 right-4 z-50">
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Navigation Menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col p-6">
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-white bg-lime-500 py-2 px-4 rounded-lg mb-2"
            >
              Home <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              About Us <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              Products <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              Services <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              Blog <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              Gallery <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              Pages <span>+</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex justify-between items-center text-lg font-semibold text-gray-700 py-2 px-4 rounded-lg hover:bg-lime-500 hover:text-white mb-2"
            >
              Contact <span>+</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ResponsiveMenu;
