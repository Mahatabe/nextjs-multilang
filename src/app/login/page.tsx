"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setIsLoggedIn } = useContext(UserContext);
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try 
    {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (result.success) 
      {
        localStorage.setItem("userId", result.user.ID);
        setIsLoggedIn(true);
        alert(t.login.title + " successful!");
        router.push("/profile");
      } 
      else 
      {
        alert(t.login.title + " failed: Invalid email or password");
      }
    } 
    catch (err) 
    {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200" >
        <h2 className="text-2xl font-bold mb-6 text-center">{t.login.title}</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email"> {t.login.email} </label>
          <input  id="email"  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password"> {t.login.password} </label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
        </div>

        <button  type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition" >
          {t.login.button}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t.login.noAccount}{" "}
          <Link href="/register" className="text-blue-600 hover:underline"> {t.login.register}</Link>
        </p>
      </form>
    </div>
  );
}
