"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function RegisterPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    nationality: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try 
    {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) 
      {
        const errorData = await res.json();
        throw new Error(errorData.message || "Server error");
      }

      const result = await res.json();

      if (result.success) 
      {
        alert(t.register.button + " successful!");
        setForm({ name: "", email: "", password: "", mobile: "", nationality: "" });
      } 
      else 
      {
        alert(`${t.register.button} failed: ${result.message}`);
      }
    } 
    catch (err: unknown) 
    {
      console.error("Fetch error:", err);
      alert(t.register.button + " failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <form onSubmit={handleRegister} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.register.title}</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">{t.register.name}</label>
          <input type="text"  name="name" id="name"  value={form.name} onChange={handleChange} required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">{t.register.email}</label>
          <input type="email"  name="email"  id="email" value={form.email} onChange={handleChange} required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">{t.register.password}</label>
          <input type="password"  name="password"  id="password"  value={form.password} onChange={handleChange} required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-gray-700 font-medium mb-1">{t.register.mobile}</label>
          <input type="tel" name="mobile" id="mobile" value={form.mobile} onChange={handleChange} required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mb-6">
          <label htmlFor="nationality" className="block text-gray-700 font-medium mb-1">{t.register.nationality}</label>
          <input type="text" name="nationality" id="nationality" value={form.nationality} onChange={handleChange} required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {t.register.button}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t.register.already}{" "}
          <Link href="/login" className="text-blue-600 hover:underline">{t.register.login}</Link>
        </p>
      </form>
    </div>
  );
}
