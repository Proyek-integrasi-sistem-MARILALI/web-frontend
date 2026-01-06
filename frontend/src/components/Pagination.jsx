import { useState, useEffect } from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}) {
  const [page, setPage] = useState(currentPage);

  // Sync with parent's currentPage
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    onPageChange?.(newPage); // callback to parent
  };

  // Generate page numbers with ellipsis
  const generatePages = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Show pages around current page
      if (page > 3) {
        pages.push("...");
      }
      
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (page < totalPages - 2) {
        pages.push("...");
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center gap-2">
      {/* PREVIOUS */}
      <button
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className={`px-3 py-1 rounded transition-colors
          ${page === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"}`}
      >
        ‹
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((p, i) => (
        <button
          key={`page-${i}-${p}`}
          disabled={p === "..."}
          onClick={() => typeof p === "number" && goToPage(p)}
          className={`px-3 py-1 rounded border transition-colors
            ${
              p === page
                ? "bg-blue-600 text-white border-blue-600"
                : p === "..."
                ? "cursor-default border-none bg-transparent"
                : "hover:bg-gray-100 border-gray-300"
            }`}
        >
          {p}
        </button>
      ))}

      {/* NEXT */}
      <button
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className={`px-3 py-1 rounded transition-colors
          ${page === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"}`}
      >
        ›
      </button>
    </div>
  );
}
