import React from "react";
import Link from "next/link";

interface IconCardProps {
	icon: React.ReactNode;
	title: React.ReactNode;
	value: React.ReactNode;
	info: React.ReactNode;
	featured?: boolean;
	actionHref?: string;
	actionLabel?: string;
}

export default function IconCard({ icon, title, value, info, featured, actionHref, actionLabel }: IconCardProps) {
	const actionClasses = `flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 ${featured ? 'border-white/30 text-white/80 hover:bg-white/15' : 'border-border text-muted-foreground hover:border-[var(--border-accent)] hover:text-primary hover:bg-primary/10'}`;
	const arrowIcon = (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
	);

	return (
		<div className={`w-full rounded-2xl border relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${featured ? 'bg-[linear-gradient(135deg,#7c3aed,#6d28d9)] text-white border-transparent shadow-[0_8px_32px_var(--border-accent)]' : 'bg-card text-card-foreground border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-[var(--border-accent)] hover:shadow-[0_4px_20px_var(--accent-purple-glow)]'}`}>
			<div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center gap-3">
					<div className={`flex items-center justify-center p-2 rounded-full ${featured ? 'bg-white/10' : 'bg-white/10 text-primary dark:text-white'}`}>
						{icon}
					</div>
					<h3 className={`tracking-normal text-sm font-medium ${featured ? 'text-white/90' : 'text-muted-foreground'}`}>{title}</h3>
				</div>
				{actionHref ? (
					<Link href={actionHref} aria-label={actionLabel || "Lihat detail"} className={actionClasses}>
						{arrowIcon}
					</Link>
				) : (
					<div className={actionClasses}>
						{arrowIcon}
					</div>
				)}
			</div>
			<div className="p-6 pt-3">
				<div className="text-4xl font-bold mb-3 text-current">{value}</div>
				<div className="text-xs">{info}</div>
			</div>
		</div>
	);
}
