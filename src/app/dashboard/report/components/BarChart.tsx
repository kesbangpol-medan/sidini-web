/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaChartBar } from "react-icons/fa6";
import {
	BarChart,
	Bar,
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
	Cell,
} from "recharts";
import { useMemo } from "react";

type BarReportChartProps = {
	data: any[];
	title?: string;
};

const palette = [
	"#8884d8",
	"#82ca9d",
	"#f54278",
	"#ffc658",
	"#8dd1e1",
	"#a4de6c",
	"#d0ed57",
	"#ff8042",
	"#00C49F",
	"#FFBB28",
	"#FF6666",
	"#9966CC",
	"#FFB6C1",
	"#00CED1",
	"#FFD700",
];

export default function BarReportChart({ data, title }: BarReportChartProps) {
	// Buat map dari nama ke warna, konsisten dan otomatis
	const colorMap = useMemo(() => {
		const uniqueNames = Array.from(new Set(data.map((d) => d.name)));
		const map: Record<string, string> = {};
		uniqueNames.forEach((name, idx) => {
			map[name] = palette[idx % palette.length];
		});
		return map;
	}, [data]);

	return (
		<div className="w-full h-[400px] rounded-xl border surface p-4">
			<div className="flex gap-2 items-center mb-4">
				<FaChartBar className="text-[var(--primary)]" />
				{title && <h2 className="text-lg font-semibold">{title}</h2>}
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
					{/* <XAxis dataKey="name" /> */}
					<XAxis
						dataKey="name"
						// angle={-45}
						textAnchor="middle"
						height={55}
						interval={0} // paksa tampil semua label
						// tick={{ fontSize: 12 }}
						tickFormatter={(value) => (value.length > 12 ? value.slice(0, 8) + "…" : value)}
					/>
					<YAxis />
					<Tooltip />
					<Bar dataKey="value" barSize={40}>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
