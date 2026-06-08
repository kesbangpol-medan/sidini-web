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
	action?: React.ReactNode;
};

const DATASET_COLORS = ["#2dd4bf", "#f97316", "#ef4444", "#eab308", "#8b5cf6", "#06b6d4"];

export default function LineReportChart({ data, title, action }: LineReportChartProps) {
	// Ambil semua key kategori dari item pertama (kecuali "month")
	const categories = useMemo(() => {
		if (!data || data.length === 0) return [];
		return Object.keys(data[0]).filter((key) => key !== "month");
	}, [data]);

	// Generate warna dari nama kategori secara konsisten
	const colorMap = useMemo(() => {
		const map: Record<string, string> = {};
		categories.forEach((cat, index) => {
			map[cat] = DATASET_COLORS[index % DATASET_COLORS.length];
		});
		return map;
	}, [categories]);

	return (
		<div className="w-full h-[450px] flex flex-col surface p-5 rounded-2xl border border-[var(--border-subtle)]">
			<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
				<div className="flex gap-2 items-center">
					<FaChartArea className="text-[var(--accent-purple-light)]" />
					{title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
				</div>
				{action && <div>{action}</div>}
			</div>

			<div className="flex-1 w-full min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
						<XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={{ stroke: "#475569" }} />
						<YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={{ stroke: "#475569" }} />
						<Tooltip
							contentStyle={{
								background: "var(--bg-card)",
								border: "1px solid var(--border-subtle)",
								borderRadius: "8px",
								color: "var(--text-primary)",
								fontSize: "12px",
							}}
						/>
						<Legend
							layout="horizontal"
							align="center"
							verticalAlign="bottom"
							wrapperStyle={{
								paddingTop: "10px",
								whiteSpace: "nowrap",
								overflowX: "auto",
								width: "100%",
								color: "var(--text-secondary)",
							}}
						/>
						{categories.map((cat) => (
							<Line
								key={cat}
								type="monotone"
								dataKey={cat}
								stroke={colorMap[cat]}
								name={cat}
								dot={{ r: 4, strokeWidth: 1, fill: "var(--bg-card)" }}
								activeDot={{ r: 6 }}
								strokeWidth={2}
							/>
						))}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
