import React from "react";

interface IconCardProps {
	icon: React.ReactNode;
	title: React.ReactNode;
	value: React.ReactNode;
	info: React.ReactNode;
	featured?: boolean;
}

export default function IconCard({ icon, title, value, info, featured }: IconCardProps) {
	return (
		<div className={`w-full rounded-2xl border shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ${featured ? 'bg-gradient-to-br from-violet-600 to-indigo-800 text-white border-transparent' : 'bg-card text-card-foreground border-border'}`}>
			<div className="p-5 flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center gap-3">
					<div className={`flex items-center justify-center p-2 rounded-xl ${featured ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
						{icon}
					</div>
					<h3 className={`tracking-tight text-sm font-medium ${featured ? 'text-white/90' : 'text-muted-foreground'}`}>{title}</h3>
				</div>
				<div className={`flex items-center justify-center w-8 h-8 rounded-full border ${featured ? 'border-white/30 text-white/80' : 'border-border text-muted-foreground'}`}>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
				</div>
			</div>
			<div className="p-5 pt-3">
				<div className="text-5xl font-bold mb-3">{value}</div>
				<div className="text-xs">{info}</div>
			</div>
		</div>
	);
}
