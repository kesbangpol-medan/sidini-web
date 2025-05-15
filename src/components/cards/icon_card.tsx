import React from "react";

interface IconCardProps {
	icon: React.ReactNode;
	title: React.ReactNode;
	value: React.ReactNode;
	info: React.ReactNode;
}

export default function IconCard({ icon, title, value, info }: IconCardProps) {
	return (
		<div className="surface w-full border rounded-lg p-6 flex flex-col gap-3">
			<div className="flex w-full  mb-5">
				<div className="icon-background">{icon}</div>
			</div>
			<div className="flex w-full">
				<h6 className="text-xs font-semibold">{title}</h6>
			</div>
			<div className="flex w-full justify-between items-center">
				<h1 className="font-bold text-3xl">{value}</h1>
				<h5>{info}</h5>
			</div>
		</div>
	);
}
