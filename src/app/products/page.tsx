"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProductPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    prodName: "",
    writer: "",
    pubDate: "",
    qty: "",
    price: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setMessage("");

    if (name === "image" && files && files.length > 0) 
    {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
    else 
    {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const body = new FormData();
    body.append("prodName", formData.prodName);
    body.append("writer", formData.writer);
    body.append("pubDate", formData.pubDate);
    body.append("qty", formData.qty);
    body.append("price", formData.price);

    if (formData.image) 
    {
      body.append("image", formData.image);
    }

    try 
    {
      const res = await fetch("/api/addproducts", {
        method: "POST",
        body,
      });

      if (res.ok) 
      {
        setMessage(t.products.success);

        setFormData({
          prodName: "",
          writer: "",
          pubDate: "",
          qty: "",
          price: "",
          image: null,
        });

        setPreview(null);
      } 
      else 
      {
        setMessage(t.products.error);
      }
    } 
    catch (err) 
    {
      console.error(err);
      setMessage(t.products.error);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t.products.title}</h1>
        <Link href="/products/list">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {t.products.viewList}
            </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-md p-6" encType="multipart/form-data">
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">{t.products.prodName}</label>
            <input type="text" name="prodName" value={formData.prodName} onChange={handleChange}
              required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">{t.products.writer}</label>
            <input type="text" name="writer" value={formData.writer} onChange={handleChange}
              required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">{t.products.quantity}</label>
            <input type="number"step="0.01" name="qty"  value={formData.qty} onChange={handleChange}
              required className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">{t.products.price}</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange}
              required className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">{t.products.pubDate}</label>
            <DatePicker
              selected={formData.pubDate ? new Date(formData.pubDate) : null}
              onChange={(date: Date | null) => {
                setFormData({
                  ...formData,
                  pubDate: date ? date.toISOString() : "",
                });
              }}
              dateFormat="dd-MMM-yyyy" placeholderText="Select a date" required showMonthDropdown showYearDropdown
              dropdownMode="select"className="w-full border rounded px-3 py-2 h-[42px] text-base"/>
          </div>

          <button type="submit" disabled={loading}
            className={`mt-4 px-6 py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`} >
            {loading ? t.products.addingButton : t.products.addButton}
          </button>

          {message && <p className="mt-2 text-sm text-green-600 font-medium">{message}</p>}
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 rounded-xl shadow-inner p-6">
          <label className="block mb-2 font-medium text-gray-700">{t.products.image}</label>

          <label className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {formData.image ? formData.image.name : "Choose File"}
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden"/>
          </label>

          {preview && (
            <div className="border rounded p-2 mt-4">
              <Image src={preview}  alt={formData.image?.name || "Image preview"} 
                width={400} height={300} className="w-full h-auto rounded shadow"/>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
