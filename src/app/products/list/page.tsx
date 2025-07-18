"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import { Product } from "@/app/api/products/route";

export default function ProductList() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || t.products.error);
        if (!data.success) throw new Error(t.products.error);
        
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.products.error);
      } finally {
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
      cell: (row: Product) => (
        <div className="text-right">
          {row.QTY}
        </div>
      )
    },
    {
      name: t.tableHeader.price,
      selector: (row: Product) => row.PRICE,
      sortable: true,
      cell: (row: Product) => (
        <div className="text-right">
          {lang === 'bn' ? `৳${row.PRICE.toFixed(2)}` : `$${row.PRICE.toFixed(2)}`}
        </div>
      )
    },
    {
      name: t.tableHeader.image,
      cell: (row: Product) => row.IMAGE ? (
        <div className="flex justify-center">
          <Image 
            src={row.IMAGE} 
            alt={row.PRODNAME}
            width={50} 
            height={50}
            className="rounded object-cover"
            priority={false}
          />
        </div>
      ) : <span className="text-gray-400">
        {lang === 'bn' ? 'ছবি নেই' : 'No image'}
      </span>,
      ignoreRowClick: true,
      width: "120px"
    }
  ];

  if (error) {
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
      <h1 className="text-2xl font-bold mb-6">{t.products.viewList}</h1>
      
      <DataTable
        columns={columns}
        data={products}
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
            {lang === 'bn' ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found'}
          </div>
        }
      />
    </div>
  );
}