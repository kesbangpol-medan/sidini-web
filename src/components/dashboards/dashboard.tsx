"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaList, FaSearch, FaUsers } from "react-icons/fa";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import AppInput from "../inputs/AppInput";
import { motion, AnimatePresence } from "framer-motion";
import { AuthUsecaseImpl } from "@/app/auth/login/domain/usecase/implementation/auth_usecase_implementation";
import { AuthRepositoryImpl } from "@/app/auth/login/domain/repository/implementation/auth_repository_implementation";
import { UserEntity } from "@/app/dashboard/user/domain/entity/user_entity";
import { MdAssessment, MdLocationCity } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";
import { TbTrees } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";

const authUsecase = new AuthUsecaseImpl(new AuthRepositoryImpl());

interface AppDashboardProps {
	content: React.ReactNode;
	activeKey: string;
	onSearchChange?: (val: string) => void;
}

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
}

const Sidebar = ({ isOpen, onClose, activeMenu = "dashboard" }: { isOpen: boolean; onClose: () => void; activeMenu?: string }) => {
	const router = useRouter();
	const menuItems = [
		// { key: "dashboard", label: "Dashboard", icon: <BiGridAlt /> },
		{ key: "report", label: "Laporan", icon: <MdAssessment /> },
		{ key: "user", label: "User", icon: <FaUsers /> },
		{ key: "department", label: "Departemen / Kategori", icon: <BiCategory /> },
		{ key: "district", label: "Kecamatan", icon: <MdLocationCity /> },
		{ key: "village", label: "Kelurahan", icon: <RiHome2Line /> },
		{ key: "subvillage", label: "Lingkungan", icon: <TbTrees /> },
	];

	return (
		<>
			<aside
				className={clsx(
					"fixed inset-y-0 left-0 w-64 border-r p-4 z-30 transition-transform duration-300 bg-[var(--surface)] text-[var(--foreground)] backdrop-blur-lg",
					{
						"-translate-x-full": !isOpen,
						"translate-x-0": isOpen,
					}
				)}
			>
				<div className="flex justify-center items-center mb-8">
					<Image src="/icon.png" alt="sidini icon" width={120} height={60} className="rounded-full object-cover" />
				</div>

				<div className="mb-4 text-sm font-medium text-[var(--disable)]">
					<span>Menu</span>
				</div>

				<nav>
					<ul className="font-semibold text-sm space-y-2">
						{menuItems.map((item) => (
							<motion.li
								key={item.key}
								whileHover={{ scale: 1.02 }}
								onClick={() => {
									const path = item.key === "dashboard" ? `/${item.key}` : `/dashboard/${item.key}`;
									router.push(path);
									onClose();
								}}
								className={clsx("flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all", {
									"bg-[var(--sidebar-menu-active-bg)] text-[var(--sidebar-menu-active-foreground)] shadow-sm": activeMenu === item.key,
									"hover:bg-[var(--sidebar-menu-active-bg)/20]": activeMenu !== item.key,
								})}
							>
								<span className="text-lg">{item.icon}</span>
								<span>{item.label}</span>
							</motion.li>
						))}
					</ul>
				</nav>
			</aside>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
						onClick={onClose}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

type UserDropdownProps = {
	user?: UserEntity;
};

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const userImg = process.env.NEXT_PUBLIC_USER_IMG;

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
			<motion.button
				whileHover={{ scale: 1.05 }}
				onClick={() => setIsOpen((prev) => !prev)}
				className="text-xl focus:outline-none flex items-center gap-2"
			>
				<Image
					src={userImg && user?.image ? `${userImg}/${user.image}` : "/avatar.jpg"}
					alt="User Avatar"
					width={45}
					height={45}
					className="rounded-full object-cover aspect-square border-2 border-[var(--primary)]"
				/>
				<div className="hidden sm:block text-start">
					{user ? (
						<>
							<h4 className="text-sm font-semibold">{user.name}</h4>
							<span className="text-xs text-[var(--disable)]">{user.role === 3 ? "Super Admin" : user.role === 2 ? "Admin" : "User"}</span>
						</>
					) : (
						<h4 className="text-sm font-semibold italic text-gray-400">Loading...</h4>
					)}
				</div>
				<FaChevronDown className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-40"
					>
						<ul className="text-sm text-[var(--foreground)]">
							<li className="px-4 py-3 hover:bg-[var(--sidebar-menu-active-bg)] cursor-pointer transition-colors">Profile</li>
							<li
								onClick={() => {
									localStorage.clear();
									router.push("/");
								}}
								className="px-4 py-3 hover:bg-[var(--sidebar-menu-active-bg)] cursor-pointer transition-colors text-[var(--danger)]"
							>
								Logout
							</li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className="relative w-full max-w-sm">
			<AppInput
				type="search"
				icon={<FaSearch className="text-[var(--disable)]" />}
				value={value}
				onChange={handleChange}
				placeHolder="Search..."
				// inputClassName="pl-10 hover:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
			/>
		</div>
	);
};

const AppDashboard: React.FC<AppDashboardProps> = ({ content, activeKey, onSearchChange }) => {
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

				<section className="flex-1 overflow-auto p-6">
					<div className="max-w-7xl mx-auto space-y-6">{content}</div>
				</section>
			</main>
		</div>
	);
};

export default AppDashboard;
