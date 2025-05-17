// import React from "react";

// export type ColumnProps<T> = {
// 	header: string;
// 	accessor: (row: T) => React.ReactNode;
// 	textAlign?: "left" | "center" | "right";
// 	textColor?: string;
// 	bgColor?: string;
// 	wrap?: boolean;
// };

// type AppTableProps<T> = {
// 	columns: ColumnProps<T>[];
// 	data: T[];
// 	onScrollBottom?: () => void;
// 	tableTitle?: string;
// 	tools?: React.ReactNode;
// };

// const AppTable = <T,>({ columns, data, tableTitle, tools }: AppTableProps<T>) => {
// 	return (
// 		<div className="surface rounded-xl border p-4 overflow-hidden">
// 			<div className="flex mt-2 justify-between items-center">
// 				<h1 className="text-lg font-semibold">{tableTitle}</h1>
// 				<div>{tools}</div>
// 			</div>

// 			<div className="w-full h-full overflow-auto">
// 				<table className="w-full mt-6">
// 					<thead className="surface sticky top-0 border-t">
// 						<tr className="text-xs font-semibold">
// 							{columns.map((column, index) => (
// 								<th
// 									key={index}
// 									className={`py-4 px-6 ${column.wrap ? "break-words" : "whitespace-nowrap"} ${
// 										column.textAlign === "center" ? "text-center" : column.textAlign === "right" ? "text-right" : "text-left"
// 									}`}
// 								>
// 									<h5>{column.header}</h5>
// 								</th>
// 							))}
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{data.map((row, rowIndex) => (
// 							<tr key={rowIndex} className="hover:bg-[var(--surface)] transition-colors duration-200 border-t">
// 								{columns.map((column, colIndex) => {
// 									const cellValue = column.accessor(row);
// 									return (
// 										<td
// 											key={colIndex}
// 											className={`py-3 px-6 text-sm ${column.wrap ? "break-words" : "whitespace-nowrap"} ${
// 												column.textAlign === "center" ? "text-center" : column.textAlign === "right" ? "text-right" : "text-left"
// 											}`}
// 										>
// 											{cellValue}
// 										</td>
// 									);
// 								})}
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	);
// };

// export default AppTable;

import React, { useEffect } from "react";
import { FaTable } from "react-icons/fa";

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
  onScrollBottom?: () => void;
  tableTitle?: string;
  tools?: React.ReactNode;
  loading?: boolean;
};

const AppTable = <T,>({ columns, data, tableTitle, tools, onScrollBottom, loading }: AppTableProps<T>) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!onScrollBottom) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onScrollBottom();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onScrollBottom]);

  return (
    <div className="surface rounded-xl border border-[var(--border)] p-4 shadow-sm max-h-[500px] flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-3 mb-3">
        <div className="flex items-center gap-2">
          {tableTitle && (
            <>
              <FaTable className="text-[var(--primary)]" />
              <h1 className="text-lg font-semibold">{tableTitle}</h1>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">{tools}</div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] sticky top-0 bg-[var(--surface)] z-10">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`
                    py-3 px-4 text-sm font-medium
                    ${column.wrap ? "break-words" : "whitespace-nowrap"}
                    ${column.textAlign === "center" ? "text-center" : column.textAlign === "right" ? "text-right" : "text-left"}
                  `}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[var(--surface)] transition-colors">
                {columns.map((column, colIndex) => {
                  const cellValue = column.accessor(row);
                  return (
                    <td
                      key={colIndex}
                      className={`
                        py-2 px-4 text-sm
                        ${column.wrap ? "break-words" : "whitespace-nowrap"}
                        ${column.textAlign === "center" ? "text-center" : column.textAlign === "right" ? "text-right" : "text-left"}
                        border-t border-[var(--border)]
                      `}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="py-8 text-center text-[var(--disable)]">
            <p className="text-sm">No data available</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppTable;
