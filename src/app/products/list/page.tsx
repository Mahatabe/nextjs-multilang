"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import { Product } from "@/app/api/products/route";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// npm install jspdf jspdf-autotable xlsx (PDF EXCEL)

export default function ProductList() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try 
      {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || t.products.error);
        if (!data.success) throw new Error(t.products.error);
        setProducts(data.products);
      } 
      catch (err) 
      {
        setError(err instanceof Error ? err.message : t.products.error);
      } 
      finally 
      {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; 
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter(product =>
      product.PRODNAME.toLowerCase().includes(search.toLowerCase()) ||
      product.PRODWRITE.toLowerCase().includes(search.toLowerCase()) ||
      product.ID.toString().includes(search) ||
      product.QTY.toString().includes(search) ||
      product.PRICE.toString().includes(search) ||
      formatDate(product.PUBDATE).toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleExport = async (format: 'PDF' | 'EXCEL') => {
    setIsExportOpen(false);

    if (format === "PDF") {
      const doc = new jsPDF();
      doc.text(lang === "bn" ? "প্রোডাক্ট রিপোর্ট" : "Product Report", 14, 15);
      
      const pdfData = await Promise.all(filteredProducts.map(async (product) => {
        let imageData = "";
        if (product.IMAGE) 
        {
          try 
          {
            const response = await fetch(product.IMAGE);
            const blob = await response.blob();
            const base64String = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
            imageData = base64String;
          } 
          catch (error) 
          {
            console.error("Error loading image:", error);
          }
        }
        
        return {
          ID: product.ID,
          Product: product.PRODNAME,
          Author: product.PRODWRITE,
          Date: formatDate(product.PUBDATE),
          Quantity: product.QTY,
          Price: product.PRICE.toFixed(2),
          Image: imageData
        };
      }));

      autoTable(doc, {
        startY: 20,
        head: [[
          t.tableHeader.id,
          t.tableHeader.image,
          t.tableHeader.product,
          t.tableHeader.name,
          t.tableHeader.date,
          t.tableHeader.quantity,
          `${t.tableHeader.price} (৳)`
        ]],
        body: pdfData.map(item => [
          item.ID,
          item.Image ? { content: '', image: item.Image, imageWidth: 15, imageHeight: 15 } : (lang === 'bn' ? 'ছবি নেই' : 'No image'),
          item.Product,
          item.Author,
          item.Date,
          item.Quantity,
          item.Price
        ]),
        columnStyles: {
          1: { cellWidth: 20 }
        },
        didDrawCell: (data) => {
          if (data.column.index === 1 && data.cell.section === 'body') {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
          }
        }
      });
      doc.save("products.pdf");
    } 
    else 
    {
      const exportData = filteredProducts.map(product => ({
        ID: product.ID,
        Product: product.PRODNAME,
        Author: product.PRODWRITE,
        Date: formatDate(product.PUBDATE),
        Quantity: product.QTY,
        Price: product.PRICE.toFixed(2)
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, "products.xlsx");
    }
  };

  const columns = [
    {
      name: t.tableHeader.id,
      selector: (row: Product) => row.ID,
      sortable: true,
      width: "80px"
    },
    {
      name: t.tableHeader.product,
      selector: (row: Product) => row.PRODNAME,
      sortable: true,
      grow: 2
    },
    {
      name: t.tableHeader.name,
      selector: (row: Product) => row.PRODWRITE,
      sortable: true,
      grow: 2
    },
    {
      name: t.tableHeader.date,
      selector: (row: Product) => formatDate(row.PUBDATE),
      sortable: true
    },
    {
      name: t.tableHeader.quantity,
      selector: (row: Product) => row.QTY,
      sortable: true,
      cell: (row: Product) => <div className="text-right">{row.QTY}</div>
    },
    {
      name: t.tableHeader.price,
      selector: (row: Product) => row.PRICE,
      sortable: true,
      cell: (row: Product) => (
        <div className="text-right">৳ {row.PRICE.toFixed(2)}</div>
      )
    },
    {
      name: t.tableHeader.image,
      cell: (row: Product) => row.IMAGE ? (
        <div className="flex justify-center">
          <Image src={row.IMAGE} alt={row.PRODNAME} width={50} height={50} className="rounded object-cover" />
        </div>
      ) : (
        <span className="text-gray-400">
          {lang === 'bn' ? 'ছবি নেই' : 'No image'}
        </span>
      ),
      ignoreRowClick: true,
      width: "120px"
    }
  ];

  if (error) 
  {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.products.viewList}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{lang === 'bn' ? 'এক্সপোর্ট' : 'Export'}</span>
              <svg className={`ml-2 w-4 h-4 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('PDF')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {lang === 'bn' ? 'পিডিএফ' : 'PDF'}
                  </button>
                  <button
                    onClick={() => handleExport('EXCEL')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {lang === 'bn' ? 'এক্সেল' : 'Excel'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search...'}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        progressPending={loading}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        highlightOnHover
        striped
        responsive
        defaultSortFieldId={1}
        customStyles={{
          headCells: {
            style: {
              backgroundColor: "#1f2937",
              color: "white",
              fontSize: "1rem",
              paddingLeft: "8px",
              paddingRight: "8px",
            },
          },
          cells: {
            style: {
              paddingTop: "12px",
              paddingBottom: "12px",
              paddingLeft: "8px",
              paddingRight: "8px",
            },
          },
        }}
        noDataComponent={
          <div className="p-4 text-center text-gray-500">
            {search 
              ? (lang === 'bn' ? 'কোন ফলাফল পাওয়া যায়নি' : 'No results found') 
              : (lang === 'bn' ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found')}
          </div>
        }
      />
    </div>
  );
}