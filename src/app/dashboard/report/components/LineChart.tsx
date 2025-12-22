/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaChartArea } from "react-icons/fa";
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";
import { useMemo } from "react";

type LineReportChartProps = {
	data: any[];
	title?: string;
};

// Fungsi untuk menghasilkan warna unik dan kontras dari string
function stringToColor(name: string) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash) % 360; // 0-359 derajat warna
	return `hsl(${hue}, 70%, 50%)`; // Saturasi & lightness tetap agar kontras
}

export default function LineReportChart({ data, title }: LineReportChartProps) {
	// Ambil semua key kategori dari item pertama (kecuali "month")
	const categories = useMemo(() => {
		if (!data || data.length === 0) return [];
		return Object.keys(data[0]).filter((key) => key !== "month");
	}, [data]);

	// Generate warna dari nama kategori secara konsisten
	const colorMap = useMemo(() => {
		const map: Record<string, string> = {};
		categories.forEach((cat) => {
			map[cat] = stringToColor(cat);
		});
		return map;
	}, [categories]);

	return (
		<div className="w-full h-[400px] surface p-4 rounded-lg border">
			<div className="flex gap-2 items-center mb-4">
				<FaChartArea className="text-[var(--primary)]" />
				{title && <h2 className="text-lg font-semibold">{title}</h2>}
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="4 4" stroke={`var(--border)`} />
					<XAxis dataKey="month" />
					<YAxis />
					<Tooltip />
					<Legend
						layout="horizontal"
						align="center"
						verticalAlign="bottom"
						wrapperStyle={{
							// paddingTop: 0,
							whiteSpace: "nowrap",
							overflowX: "auto",
							width: "100%",
						}}
					/>
					{categories.map((cat) => (
						<Line key={cat} type="monotone" dataKey={cat} stroke={colorMap[cat]} name={cat} />
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
