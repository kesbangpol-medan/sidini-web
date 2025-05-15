import React from "react";

export type ColumnProps<T> = {
	header: string;
	accessor: (row: T) => React.ReactNode;
	textAlign?: "left" | "center" | "right";
	textColor?: string;
	bgColor?: string;
	wrap?: boolean;
};

type AppTableProps<T> = {
	columns: ColumnProps<T>[];
	data: T[];
	onScrollBottom?: () => void;
	tableTitle?: string;
  tools?: React.ReactNode
};

const AppTable = <T,>({ columns, data, tableTitle, tools }: AppTableProps<T>) => {
	return (
		<div className="surface rounded-xl overflow-auto border p-4">
			<div className="flex mt-2 justify-between items-center">
				<h1 className="text-lg font-semibold">{tableTitle}</h1>
        <div>{tools}</div>
			</div>

			<table className="w-full mt-6">
				<thead className="surface sticky top-0 border-t">
					<tr className="text-xs font-semibold">
						{columns.map((column, index) => (
							<th
								key={index}
								className={`py-4 px-6 ${column.wrap ? "break-words" : "whitespace-nowrap"} ${
									column.textAlign === "center" ? "text-center" : column.textAlign === "right" ? "text-right" : "text-left"
								}`}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex} className="hover:bg-[var(--surface)] transition-colors duration-200 border-t">
							{columns.map((column, colIndex) => {
								const cellValue = column.accessor(row);
								return (
									<td
										key={colIndex}
										className={`py-3 px-6 text-sm ${column.wrap ? "break-words" : "whitespace-nowrap"} ${
											column.textAlign === "center" ? "text-center" : column.textAlign === "right" ? "text-right" : "text-left"
										}`}
									>
										{cellValue}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AppTable;
