import React, { useState, useMemo } from "react";
import { FaTable, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type ColumnProps<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  bgColor?: string;
  wrap?: boolean;
  width?: string | number;
};

type AppTableProps<T> = {
  columns: ColumnProps<T>[];
  data: T[];
  tableTitle?: string;
  tools?: React.ReactNode;
  loading?: boolean;
  /** Aktifkan pagination built-in */
  pagination?: boolean;
  /** Pilihan jumlah row per halaman */
  pageSizeOptions?: number[];
  /** Default jumlah row per halaman */
  defaultPageSize?: number;
  /** Callback dipanggil saat user scroll mendekati bagian bawah tabel (infinite scroll) */
  onScrollBottom?: () => void;
};

const AppTable = <T,>({
  columns,
  data,
  tableTitle,
  tools,
  loading,
  pagination = false,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  onScrollBottom,
}: AppTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const paginatedData = useMemo(() => {
    if (!pagination) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize, pagination]);

  const totalPages = useMemo(
    () => (pagination ? Math.max(1, Math.ceil(data.length / pageSize)) : 1),
    [data.length, pageSize, pagination]
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    for (let i = left; i <= right; i++) range.push(i);
    return range;
  }, [currentPage, totalPages]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0.75rem",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Card Header ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-card)",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {tableTitle && (
            <>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.75rem",
                  height: "1.75rem",
                  borderRadius: "0.375rem",
                  backgroundColor:
                    "color-mix(in oklab, var(--primary) 12%, transparent)",
                  color: "var(--accent-purple-light)",
                  flexShrink: 0,
                }}
              >
                <FaTable size={12} />
              </span>
              <h2
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {tableTitle}
              </h2>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {tools}
        </div>
      </div>

      {/* ── Table Scroll Container ──────────────────────────────────────── */}
      <div
        style={{ overflowX: "auto", overflowY: "auto", maxHeight: "520px" }}
        onScroll={(e) => {
          if (!onScrollBottom) return;
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
            onScrollBottom();
          }
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
            tableLayout: "auto",
          }}
        >
          {/* thead */}
          <thead>
            <tr
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{
                    padding: "0.625rem 1rem",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    textAlign: column.textAlign ?? "left",
                    whiteSpace: column.wrap ? "normal" : "nowrap",
                    width: column.width,
                    borderRight:
                      index < columns.length - 1
                        ? "1px solid var(--border-subtle)"
                        : undefined,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* tbody */}
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <ShadcnRow
                key={rowIndex}
                row={row}
                columns={columns}
                rowIndex={rowIndex}
                totalCols={columns.length}
              />
            ))}
          </tbody>
        </table>

        {/* ── Empty state ────────────────────────────────────────────── */}
        {data.length === 0 && !loading && (
          <div
            style={{
              padding: "3.5rem 1rem",
              textAlign: "center",
              color: "var(--text-muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.45 }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="11" y2="17" />
            </svg>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                margin: 0,
                color: "var(--text-primary)",
                opacity: 0.55,
              }}
            >
              Tidak ada data
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                margin: 0,
                color: "var(--text-muted)",
              }}
            >
              Data belum tersedia atau tidak ditemukan
            </p>
          </div>
        )}

        {/* ── Loading skeleton ───────────────────────────────────────── */}
        {loading && (
          <div style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "2.25rem",
                  backgroundColor:
                    "color-mix(in oklab, var(--foreground) 6%, transparent)",
                  borderRadius: "0.375rem",
                  marginBottom: "0.5rem",
                  opacity: 1.1 - i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination Footer ───────────────────────────────────────────── */}
      {pagination && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          {/* Per-page selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>Tampilkan</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.375rem",
                padding: "0.2rem 0.5rem",
                fontSize: "0.8125rem",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span style={{ color: "var(--text-secondary)" }}>/ halaman</span>
          </div>

          {/* Info + navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginRight: "0.5rem",
                whiteSpace: "nowrap",
              }}
            >
              {data.length === 0
                ? "0 data"
                : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                    currentPage * pageSize,
                    data.length
                  )} dari ${data.length}`}
            </span>

            {/* Prev */}
            <PaginationBtn
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              <FaChevronLeft size={10} />
            </PaginationBtn>

            {/* First page + ellipsis */}
            {pageNumbers[0] > 1 && (
              <>
                <PaginationBtn onClick={() => setCurrentPage(1)}>1</PaginationBtn>
                {pageNumbers[0] > 2 && (
                  <span
                    style={{
                      padding: "0 0.125rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    …
                  </span>
                )}
              </>
            )}

            {/* Numbered pages */}
            {pageNumbers.map((page) => (
              <PaginationBtn
                key={page}
                onClick={() => setCurrentPage(page)}
                active={page === currentPage}
              >
                {page}
              </PaginationBtn>
            ))}

            {/* Last page + ellipsis */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span
                    style={{
                      padding: "0 0.125rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    …
                  </span>
                )}
                <PaginationBtn onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationBtn>
              </>
            )}

            {/* Next */}
            <PaginationBtn
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Halaman berikutnya"
            >
              <FaChevronRight size={10} />
            </PaginationBtn>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────

/**
 * Row dengan zebra-stripe + hover via React state
 * (Inline style tidak mendukung pseudo-class :hover, jadi kita pakai state)
 */
function ShadcnRow<T>({
  row,
  columns,
  rowIndex,
  totalCols,
}: {
  row: T;
  columns: ColumnProps<T>[];
  rowIndex: number;
  totalCols: number;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: hovered
          ? "rgba(255,255,255,0.05)"
          : rowIndex % 2 === 0
          ? "var(--bg-card)"
          : "color-mix(in oklab, var(--text-primary) 2%, var(--bg-card))",
        transition: "background-color 200ms ease",
        cursor: "default",
      }}
    >
      {columns.map((column, colIndex) => (
        <td
          key={colIndex}
          style={{
            padding: "0.6875rem 1rem",
            fontSize: "0.875rem",
            color: "var(--text-primary)",
            textAlign: column.textAlign ?? "left",
            whiteSpace: column.wrap ? "normal" : "nowrap",
            verticalAlign: "middle",
            lineHeight: 1.5,
            borderRight:
              colIndex < totalCols - 1
                ? "1px solid var(--border-subtle)"
                : undefined,
          }}
        >
          {column.accessor(row)}
        </td>
      ))}
    </tr>
  );
}

/**
 * Tombol pagination dengan hover effect via React state
 */
function PaginationBtn({
  children,
  onClick,
  disabled,
  active,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  [key: string]: unknown;
}) {
  const [hovered, setHovered] = React.useState(false);

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "2rem",
    height: "2rem",
    padding: "0 0.375rem",
    borderRadius: "0.375rem",
    border: "1px solid",
    fontSize: "0.8125rem",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.38 : 1,
    transition:
      "background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
    outline: "none",
    backgroundColor: active
      ? "var(--accent-purple)"
      : hovered && !disabled
      ? "color-mix(in oklab, var(--accent-purple) 12%, var(--bg-card))"
      : "var(--bg-card)",
    borderColor: active
      ? "var(--accent-purple)"
      : hovered && !disabled
      ? "var(--border-accent)"
      : "var(--border-subtle)",
    color: active ? "#ffffff" : "var(--text-primary)",
    boxShadow: active
      ? "0 4px 20px var(--accent-purple-glow)"
      : "none",
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}

export default AppTable;
