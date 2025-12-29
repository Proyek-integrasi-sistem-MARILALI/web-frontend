import { useState } from "react";

export default function Pagination({
  totalPages = 10,
  onChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onChange?.(page); // callback ke parent (optional)
  };

  const pages = [1, 2, 3, "...", totalPages];

  return (
    <div className="flex items-center gap-2">
      {/* PREVIOUS */}
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className={`px-3 py-1 rounded
          ${currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white"}`}
      >
        ‹
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((p, i) => (
        <button
          key={i}
          disabled={p === "..."}
          onClick={() => typeof p === "number" && goToPage(p)}
          className={`px-3 py-1 rounded border
            ${
              p === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100"
            }
            ${p === "..." && "cursor-default border-none"}`}
        >
          {p}
        </button>
      ))}

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className={`px-3 py-1 rounded
          ${currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white"}`}
      >
        ›
      </button>
    </div>
  );
}
