"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthUsecaseImpl } from "@/app/auth/login/domain/usecase/implementation/auth_usecase_implementation";
import { AuthRepositoryImpl } from "@/app/auth/login/domain/repository/implementation/auth_repository_implementation";
import { UserEntity } from "@/app/dashboard/user/domain/entity/user_entity";
import AppLoading from "../loading/AppLoading";
import Sidebar from "./components/sidebar";
import UserDropdown from "./components/user_dropdown";
import SearchBar from "./components/search_bar";

const authUsecase = new AuthUsecaseImpl(new AuthRepositoryImpl());

interface AppDashboardProps {
	content: React.ReactNode;
	activeKey: string;
	onSearchChange?: (val: string) => void;
	isLoading: boolean;
}

<Sidebar isOpen={true} onClose={() => {}} activeMenu="report" />;

const AppDashboard: React.FC<AppDashboardProps> = ({ content, activeKey, onSearchChange, isLoading }) => {
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [user, setUser] = useState<UserEntity>();

	const handleSearchChange = (value: string) => {
		setSearchValue(value);
		if (onSearchChange) {
			onSearchChange(value);
		}
	};

	const getMe = useCallback(async () => {
		try {
			const res = await authUsecase.getMe();
			setUser(res);
			if (res.role < 2) {
				localStorage.clear();
				router.push("/");
			}
		} catch {
			localStorage.clear();
			router.push("/");
		}
	}, [router]);

	useEffect(() => {
		getMe();
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		setSidebarOpen(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [getMe]);

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-[var(--background)] to-[var(--surface)/50]">
			{isLoading && <AppLoading />}
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeMenu={activeKey} />

			<main
				className={clsx("flex-1 flex flex-col min-w-0 transition-all", {
					"md:ml-64": sidebarOpen,
				})}
			>
				<header className="sticky top-0 z-10 bg-[var(--surface)/80] backdrop-blur-lg border-b border-[var(--border)] h-20 flex items-center gap-4 px-6">
					<motion.button
						whileHover={{ scale: 1.05 }}
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-3 border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition-all"
					>
						<FaList className="text-[var(--foreground)]" />
					</motion.button>

					<SearchBar value={searchValue} onChange={handleSearchChange} />

					<div className="flex-1 flex justify-end">
						<UserDropdown user={user} />
					</div>
				</header>

				<section className="flex-1 p-6">
					<div className="max-w-7xl mx-auto space-y-6">{content}</div>
				</section>
			</main>
		</div>
	);
};

export default AppDashboard;
