// "use client";
// import Image from "next/image";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { FaChevronDown, FaFile, FaList, FaSearch, FaTh, FaUsers } from "react-icons/fa";
// import clsx from "clsx";
// import { useRouter } from "next/navigation";
// import AppInput from "../inputs/AppInput";

// interface AppDashboardProps {
// 	content: React.ReactNode;
// 	activeKey: string;
// }

// const Sidebar = ({ isOpen, onClose, activeMenu = "dashboard" }: { isOpen: boolean; onClose: () => void; activeMenu?: string }) => {
// 	const router = useRouter();
// 	const menuItems = [
// 		{ key: "dashboard", label: "Dashboard", icon: <FaTh /> },
// 		{ key: "report", label: "Laporan", icon: <FaFile /> },
// 		{ key: "user", label: "User", icon: <FaUsers /> },
// 	];

// 	return (
// 		<>
// 			<aside
// 				className={clsx(
// 					"fixed inset-y-0 left-0 w-64 md:w-1/5 border-r p-4 transform transition-transform duration-300 ease-in-out z-20",
// 					"bg-[var(--surface)] text-[var(--foreground)]",
// 					{
// 						"-translate-x-full": !isOpen,
// 						"translate-x-0": isOpen,
// 					}
// 				)}
// 			>
// 				<div className="w-full flex justify-center items-center mb-5">
// 					<Image src="/icon.png" alt="sidini icon" width={120} height={60} className="rounded-full object-cover" />
// 				</div>

// 				<div className="mb-2 text-sm font-thin">
// 					<span>Menu</span>
// 				</div>

// 				<nav>
// 					<ul className="font-semibold text-sm space-y-2">
// 						{menuItems.map((item) => (
// 							<li
// 								key={item.key}
// 								onClick={() => {
// 									if (item.key === "dashboard") {
// 										router.push(`/${item.key}`);
// 									} else {
// 										router.push(`/dashboard/${item.key}`);
// 									}
// 								}}
// 								className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition", {
// 									"bg-[var(--sidebar-menu-active-bg)] text-[var(--sidebar-menu-active-foreground)]": activeMenu === item.key,
// 									"hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--foreground)]": activeMenu !== item.key,
// 								})}
// 							>
// 								{item.icon}
// 								<span>{item.label}</span>
// 							</li>
// 						))}
// 					</ul>
// 				</nav>
// 			</aside>

// 			{/* Mobile overlay */}
// 			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={onClose} />}
// 		</>
// 	);
// };

// const UserDropdown = () => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const dropdownRef = useRef<HTMLDivElement>(null);

// 	const handleClickOutside = useCallback((event: MouseEvent) => {
// 		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
// 			setIsOpen(false);
// 		}
// 	}, []);

// 	useEffect(() => {
// 		document.addEventListener("mousedown", handleClickOutside);
// 		return () => document.removeEventListener("mousedown", handleClickOutside);
// 	}, [handleClickOutside]);

// 	return (
// 		<div className="relative" ref={dropdownRef}>
// 			<button onClick={() => setIsOpen(!isOpen)} className="text-xl focus:outline-none flex items-center gap-2 cursor-pointer">
// 				<Image src="/avatar.jpg" alt="User Avatar" width={45} height={45} className="rounded-full object-cover" />
// 				<span className="text-sm font-semibold hidden sm:inline">Nama User</span>
// 				<FaChevronDown className="text-xs" />
// 			</button>

// 			{isOpen && (
// 				<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-30">
// 					<ul className="text-sm text-gray-700">
// 						<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
// 						<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
// 					</ul>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// const SearchBar = () => (
// 	<div className="relative w-full max-w-sm">
// 		<AppInput type="search" icon={<FaSearch />} />
// 	</div>
// );

// const AppDashboard: React.FC<AppDashboardProps> = ({ content, activeKey }) => {
// 	const [sidebarOpen, setSidebarOpen] = useState(false);

// 	useEffect(() => {
// 		const mediaQuery = window.matchMedia("(min-width: 768px)");
// 		setSidebarOpen(mediaQuery.matches);

// 		const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
// 		mediaQuery.addEventListener("change", handler);
// 		return () => mediaQuery.removeEventListener("change", handler);
// 	}, []);

// 	return (
// 		<div className="flex h-screen overflow-hidden">
// 			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeMenu={activeKey} />

// 			<main className={clsx("flex-1 flex flex-col", { "md:ml-[20%]": sidebarOpen })}>
// 				<header className="surface flex items-center gap-4 p-4 border-b h-20">
// 					<button
// 						onClick={() => setSidebarOpen(!sidebarOpen)}
// 						className="flex items-center justify-center border rounded-lg p-3 shadow"
// 						aria-label="Toggle sidebar"
// 					>
// 						<FaList />
// 					</button>

// 					<SearchBar />

// 					<div className="flex-1 flex justify-end items-center">
// 						<UserDropdown />
// 					</div>
// 				</header>

// 				<section className="flex-1 overflow-auto p-4 space-y-4">{content}</section>
// 			</main>
// 		</div>
// 	);
// };

// export default AppDashboard;

"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaFile, FaList, FaSearch, FaTh, FaUsers } from "react-icons/fa";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import AppInput from "../inputs/AppInput";

interface AppDashboardProps {
	content: React.ReactNode;
	activeKey: string;
}

const Sidebar = ({ isOpen, onClose, activeMenu = "dashboard" }: { isOpen: boolean; onClose: () => void; activeMenu?: string }) => {
	const router = useRouter();
	const menuItems = [
		{ key: "dashboard", label: "Dashboard", icon: <FaTh /> },
		{ key: "report", label: "Laporan", icon: <FaFile /> },
		{ key: "user", label: "User", icon: <FaUsers /> },
	];

	return (
		<>
			<aside
				className={clsx(
					"fixed inset-y-0 left-0 w-64 border-r p-4 transform transition-transform duration-300 ease-in-out z-20",
					"bg-[var(--surface)] text-[var(--foreground)]",
					{
						"-translate-x-full": !isOpen,
						"translate-x-0": isOpen,
					}
				)}
			>
				<div className="w-full flex justify-center items-center mb-5">
					<Image src="/icon.png" alt="sidini icon" width={120} height={60} className="rounded-full object-cover" />
				</div>

				<div className="mb-2 text-sm font-thin">
					<span>Menu</span>
				</div>

				<nav>
					<ul className="font-semibold text-sm space-y-2">
						{menuItems.map((item) => (
							<li
								key={item.key}
								onClick={() => {
									if (item.key === "dashboard") {
										router.push(`/${item.key}`);
									} else {
										router.push(`/dashboard/${item.key}`);
									}
								}}
								className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition", {
									"bg-[var(--sidebar-menu-active-bg)] text-[var(--sidebar-menu-active-foreground)]": activeMenu === item.key,
									"hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--foreground)]": activeMenu !== item.key,
								})}
							>
								{item.icon}
								<span>{item.label}</span>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			{/* Mobile overlay */}
			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={onClose} />}
		</>
	);
};

const UserDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button onClick={() => setIsOpen(!isOpen)} className="text-xl focus:outline-none flex items-center gap-2 cursor-pointer">
				<Image src="/avatar.jpg" alt="User Avatar" width={45} height={45} className="rounded-full object-cover aspect-square" />
				<h4 className="text-sm font-semibold hidden sm:inline">Nama User</h4>
				<FaChevronDown className="text-xs" />
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-30">
					<ul className="text-sm text-gray-700">
						<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
						<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
					</ul>
				</div>
			)}
		</div>
	);
};

const SearchBar = () => (
	<div className="relative w-full max-w-sm">
		<AppInput type="search" icon={<FaSearch />} />
	</div>
);

const AppDashboard: React.FC<AppDashboardProps> = ({ content, activeKey }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		setSidebarOpen(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return (
		<div className="flex min-h-screen bg-[var(--background)]">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeMenu={activeKey} />
			<main className={clsx("flex-1 flex flex-col transition-all duration-300 overflow-hidden", { "md:ml-64": sidebarOpen })}>
				<header className="surface flex items-center gap-4 p-4 border-b h-20 flex-shrink-0">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="flex items-center justify-center border rounded-lg p-3 shadow"
						aria-label="Toggle sidebar"
					>
						<FaList />
					</button>

					<SearchBar />

					<div className="flex-1 flex justify-end items-center">
						<UserDropdown />
					</div>
				</header>

				<section className="flex-1 overflow-auto p-4 space-y-4 max-w-full">{content}</section>
			</main>
		</div>
	);
};

export default AppDashboard;
