// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FaChartBar } from "react-icons/fa6";
// import {
// 	BarChart,
// 	Bar,
// 	CartesianGrid,
// 	XAxis,
// 	YAxis,
// 	ResponsiveContainer,
// 	Tooltip,
// 	Legend,
// } from "recharts";

// type BarReportChartProps = {
// 	data: any[];
// 	bars: { dataKey: string; color: string; label?: string }[];
// 	title?: string;
// 	xAxisKey?: string;
// };

// export default function BarReportChart({
// 	data,
// 	bars,
// 	title,
// 	xAxisKey = "name",
// }: BarReportChartProps) {
// 	return (
// 		<div className="w-full h-[400px] rounded-xl border surface p-4">
// 			<div className="flex gap-2 items-center mb-4">
// 				<FaChartBar className="text-[var(--primary)]" />
// 				{title && <h2 className="text-lg font-semibold">{title}</h2>}
// 			</div>

// 			<ResponsiveContainer width="100%" height="100%">
// 				<BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
// 					<CartesianGrid strokeDasharray="4 4" stroke={`var(--border)`} />
// 					<XAxis dataKey={xAxisKey} />
// 					<YAxis />
// 					<Tooltip />
// 					<Legend />
// 					{bars.map((bar) => (
// 						<Bar
// 							key={bar.dataKey}
// 							dataKey={bar.dataKey}
// 							fill={bar.color}
// 							name={bar.label || bar.dataKey}
// 							barSize={30}
// 						/>
// 					))}
// 				</BarChart>
// 			</ResponsiveContainer>
// 		</div>
// 	);
// }

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
	Legend,
	Cell,
} from "recharts";

type BarReportChartProps = {
	data: any[];
	title?: string;
};

const colors: Record<string, string> = {
	Sosial: "#8884d8",
	Kesehatan: "#82ca9d",
	Politik: "#f54278",
};

export default function BarReportChart({ data, title }: BarReportChartProps) {
	return (
		<div className="w-full h-[400px] rounded-xl border surface p-4">
			<div className="flex gap-2 items-center mb-4">
				<FaChartBar className="text-[var(--primary)]" />
				{title && <h2 className="text-lg font-semibold">{title}</h2>}
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="value" barSize={40}>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors[entry.name] || "#8884d8"} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
