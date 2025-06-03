import React from "react";

const AppLoading: React.FC = () => {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--loading-background)]">
			<div className="h-10 w-10 border-4 border-[var(--loading-foreground)] border-t-transparent rounded-full animate-spin" />
			<p className="mt-4 text-sm text-[var(--loading-foreground)]">Loading...</p>
		</div>
	);
};

export default AppLoading;
