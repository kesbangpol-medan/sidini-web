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

type LineReportChartProps = {
	data: any[];
	lines: { dataKey: string; color: string; label?: string }[];
	title?: string;
};

export default function LineReportChart({ data, lines, title }: LineReportChartProps) {
	return (
		<div className="w-full h-[400px] surface p-4 rounded-lg border">
            <div className="flex gap-2 items-center mb-4">
                <FaChartArea className="text-[var(--primary)]" />
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
            </div>
			
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="4 4" stroke={`var(--border)`} />
					<XAxis dataKey="month" />
					<YAxis />
					<Tooltip />
					<Legend />
					{lines.map((line) => (
						<Line
							key={line.dataKey}
							type="monotone"
							dataKey={line.dataKey}
							stroke={line.color}
							name={line.label || line.dataKey}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
