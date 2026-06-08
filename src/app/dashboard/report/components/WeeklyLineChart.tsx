/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FaChartLine } from "react-icons/fa";
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
import { useMemo, useState } from "react";

type WeeklyLineChartProps = {
	departments: { id: number; name: string }[];
	reports: {
		department?: { name?: string };
		date_time: string;
	}[];
};

const DATASET_COLORS = ["#2dd4bf", "#f97316", "#ef4444", "#eab308", "#8b5cf6", "#06b6d4"];

const MONTHS = [
	{ value: 1, label: "Januari" },
	{ value: 2, label: "Februari" },
	{ value: 3, label: "Maret" },
	{ value: 4, label: "April" },
	{ value: 5, label: "Mei" },
	{ value: 6, label: "Juni" },
	{ value: 7, label: "Juli" },
	{ value: 8, label: "Agustus" },
	{ value: 9, label: "September" },
	{ value: 10, label: "Oktober" },
	{ value: 11, label: "November" },
	{ value: 12, label: "Desember" },
];

const WEEKS = [
	{ value: 1, label: "Minggu 1" },
	{ value: 2, label: "Minggu 2" },
	{ value: 3, label: "Minggu 3" },
	{ value: 4, label: "Minggu 4" },
	{ value: 5, label: "Minggu 5" },
];

function generateMonthlyDataByWeek(
	month: number,
	departments: { id: number; name: string }[],
	reports: WeeklyLineChartProps["reports"]
) {
	const now = new Date();
	const year = now.getFullYear();
	const lastDayOfMonth = new Date(year, month, 0).getDate();

	return WEEKS.map((week) => {
		const startDay = (week.value - 1) * 7 + 1;
		const endDay = Math.min(week.value * 7, lastDayOfMonth);
		const row: any = { week: week.label };
		departments.forEach((dep) => {
			row[dep.name] = reports.filter((report) => {
				const reportDate = new Date(report.date_time);
				return (
					report.department?.name === dep.name &&
					reportDate.getFullYear() === year &&
					reportDate.getMonth() + 1 === month &&
					reportDate.getDate() >= startDay &&
					reportDate.getDate() <= endDay
				);
			}).length;
		});
		return row;
	});
}

export default function WeeklyLineChart({ departments, reports }: WeeklyLineChartProps) {
	const currentMonth = new Date().getMonth() + 1;
	const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

	const weeklyData = useMemo(
		() => generateMonthlyDataByWeek(selectedMonth, departments, reports),
		[selectedMonth, departments, reports]
	);

	const categories = useMemo(
		() => departments.map((d) => d.name),
		[departments]
	);

	const colorMap = useMemo(() => {
		const map: Record<string, string> = {};
		categories.forEach((cat, index) => {
			map[cat] = DATASET_COLORS[index % DATASET_COLORS.length];
		});
		return map;
	}, [categories]);

	return (
		<div className="w-full flex flex-col surface p-5 rounded-2xl border border-[var(--border-subtle)]">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
				<div className="flex gap-2 items-center">
					<FaChartLine className="text-[var(--accent-purple-light)]" />
					<h2 className="text-lg font-semibold text-foreground">Statistik Laporan Bulanan</h2>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap gap-2 items-center">
					{/* Filter Bulan */}
					<select
						id="weekly-chart-month-filter"
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(Number(e.target.value))}
						className="text-sm border border-[var(--border-accent)] rounded-lg px-3 py-1.5 bg-[#1e293b] text-white focus:outline-none focus:shadow-[0_0_0_3px_var(--accent-purple-glow)] cursor-pointer transition-all duration-200 hover:border-[var(--accent-purple)]"
					>
						{MONTHS.map((m) => (
							<option key={m.value} value={m.value}>
								{m.label}
							</option>
						))}
					</select>

				</div>
			</div>

			{/* Chart */}
			<div className="w-full h-[380px]">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
						<XAxis dataKey="week" tick={{ fill: "#475569", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={{ stroke: "#475569" }} />
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
								fontSize: "12px",
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
								dot={{ r: 4 }}
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
