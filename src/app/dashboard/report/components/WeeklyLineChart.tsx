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

// Fungsi untuk menghasilkan warna unik dan kontras dari string
function stringToColor(name: string) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash) % 360;
	return `hsl(${hue}, 70%, 50%)`;
}

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
];

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function generateWeeklyData(
	month: number,
	week: number,
	departments: { id: number; name: string }[],
	reports: WeeklyLineChartProps["reports"]
) {
	const now = new Date();
	const year = now.getFullYear();
	const startDay = (week - 1) * 7 + 1;
	const endDay = week === 4 ? new Date(year, month, 0).getDate() : week * 7;

	return DAYS.map((day, dayIdx) => {
		const row: any = { day };
		departments.forEach((dep) => {
			row[dep.name] = reports.filter((report) => {
				const reportDate = new Date(report.date_time);
				return (
					report.department?.name === dep.name &&
					reportDate.getFullYear() === year &&
					reportDate.getMonth() + 1 === month &&
					reportDate.getDate() >= startDay &&
					reportDate.getDate() <= endDay &&
					reportDate.getDay() === ((dayIdx + 1) % 7)
				);
			}).length;
		});
		return row;
	});
}

export default function WeeklyLineChart({ departments, reports }: WeeklyLineChartProps) {
	const currentMonth = new Date().getMonth() + 1;
	const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
	const [selectedWeek, setSelectedWeek] = useState<number>(1);

	const weeklyData = useMemo(
		() => generateWeeklyData(selectedMonth, selectedWeek, departments, reports),
		[selectedMonth, selectedWeek, departments, reports]
	);

	const categories = useMemo(
		() => departments.map((d) => d.name),
		[departments]
	);

	const colorMap = useMemo(() => {
		const map: Record<string, string> = {};
		categories.forEach((cat) => {
			map[cat] = stringToColor(cat);
		});
		return map;
	}, [categories]);

	return (
		<div className="w-full flex flex-col surface p-4 rounded-lg border">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
				<div className="flex gap-2 items-center">
					<FaChartLine className="text-[var(--primary)]" />
					<h2 className="text-lg font-semibold">Statistik Laporan Mingguan</h2>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap gap-2 items-center">
					{/* Filter Bulan */}
					<select
						id="weekly-chart-month-filter"
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(Number(e.target.value))}
						className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition-all hover:border-[var(--primary)]"
					>
						{MONTHS.map((m) => (
							<option key={m.value} value={m.value}>
								{m.label}
							</option>
						))}
					</select>

					{/* Filter Minggu */}
					<select
						id="weekly-chart-week-filter"
						value={selectedWeek}
						onChange={(e) => setSelectedWeek(Number(e.target.value))}
						className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition-all hover:border-[var(--primary)]"
					>
						{WEEKS.map((w) => (
							<option key={w.value} value={w.value}>
								{w.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Chart */}
			<div className="w-full h-[380px]">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
						<CartesianGrid strokeDasharray="4 4" stroke={`var(--border)`} />
						<XAxis dataKey="day" tick={{ fontSize: 12 }} />
						<YAxis tick={{ fontSize: 12 }} />
						<Tooltip
							contentStyle={{
								background: "var(--surface)",
								border: "1px solid var(--border)",
								borderRadius: "8px",
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
