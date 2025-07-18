"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const { lang, setLang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"login" | "profile" | "products">(
    isLoggedIn ? "profile" : "login"
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setActiveTab("login");
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="w-full bg-gray-900 text-white fixed top-0 left-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">Next.js</span>
        </Link>

        {/* Mobile menu toggle button */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-6">
          {isLoggedIn ? (
            <>

              <Link
                  href="/products"
                  onClick={() => setActiveTab("products")}
                  className={`cursor-pointer hover:text-gray-300 ${
                    activeTab === "products" ? "border-b-2 border-white font-semibold" : "" }`}>
                  {t.navbar.products}
              </Link>

              <Link
                href="/profile"
                onClick={() => setActiveTab("profile")}
                className={`cursor-pointer hover:text-gray-300 ${
                  activeTab === "profile"
                    ? "border-b-2 border-white font-semibold"
                    : ""
                }`}
              >
                {t.navbar.profile}
              </Link>



              <button
                onClick={handleLogout}
                className="hover:text-red-400 cursor-pointer bg-transparent border-none"
              >
                {t.navbar.logout}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setActiveTab("login")}
              className={`cursor-pointer hover:text-gray-300 ${
                activeTab === "login"
                  ? "border-b-2 border-white font-semibold"
                  : ""
              }`}
            >
              {t.navbar.login}
            </Link>
          )}

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 border border-gray-400 rounded px-3 py-1 hover:bg-gray-700 transition"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span>{languages.find((l) => l.code === lang)?.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <ul
                className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg"
                role="menu"
                aria-label="Languages"
              >
                {languages.map(({ code, label }) => (
                  <li key={code}>
                    <button
                      onClick={() => {
                        setLang(code as "en" | "bn");
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                        lang === code ? "font-semibold bg-gray-700" : ""
                      }`}
                      role="menuitem"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-gray-900 px-6 pb-4">
          <div className="flex flex-col space-y-3 mt-2">
            {isLoggedIn ? (
              <>

                <Link
                  href="/products"
                  onClick={() => {
                    setActiveTab("products");
                    setMobileMenuOpen(false);
                  }}
                  className={`block cursor-pointer hover:text-gray-300 ${
                    activeTab === "products" ? "border-b-2 border-white font-semibold" : ""
                  }`}
                >
                  {t.navbar.products}
                </Link>

                <Link
                  href="/profile"
                  onClick={() => {
                    setActiveTab("profile");
                    setMobileMenuOpen(false);
                  }}
                  className={`block cursor-pointer hover:text-gray-300 ${
                    activeTab === "profile"
                      ? "border-b-2 border-white font-semibold"
                      : ""
                  }`}
                >
                  {t.navbar.profile}
                </Link>


                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-left hover:text-red-400"
                >
                  {t.navbar.logout}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => {
                  setActiveTab("login");
                  setMobileMenuOpen(false);
                }}
                className={`block cursor-pointer hover:text-gray-300 ${
                  activeTab === "login"
                    ? "border-b-2 border-white font-semibold"
                    : ""
                }`}
              >
                {t.navbar.login}
              </Link>
            )}

            {/* Mobile Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 border border-gray-400 rounded px-3 py-1 hover:bg-gray-700 transition w-full justify-between"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <span>{languages.find((l) => l.code === lang)?.label}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul
                  className="absolute left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow-lg z-50"
                  role="menu"
                  aria-label="Languages"
                >
                  {languages.map(({ code, label }) => (
                    <li key={code}>
                      <button
                        onClick={() => {
                          setLang(code as "en" | "bn");
                          setDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                          lang === code ? "font-semibold bg-gray-700" : ""
                        }`}
                        role="menuitem"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
