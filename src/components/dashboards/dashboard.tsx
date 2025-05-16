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
// 	onSearchChange?: (val: string) => void;
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
// 			{/* <aside
//         className={clsx(
//           "fixed inset-y-0 left-0 w-64 border-r p-4 z-30 transition-transform duration-300 bg-[var(--surface)] text-[var(--foreground)]",
//           {
//             "-translate-x-full md:translate-x-0": !isOpen,
//             "translate-x-0": isOpen,
//           }
//         )}
//       > */}
// 			<aside
// 				className={clsx("fixed inset-y-0 left-0 w-64 border-r p-4 z-30 transition-transform duration-300 bg-[var(--surface)] text-[var(--foreground)]", {
// 					"-translate-x-full": !isOpen,
// 					"translate-x-0": isOpen,
// 				})}
// 			>
// 				<div className="flex justify-center items-center mb-5">
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
// 									const path = item.key === "dashboard" ? `/${item.key}` : `/dashboard/${item.key}`;
// 									router.push(path);
// 									onClose(); // close sidebar on mobile
// 								}}
// 								className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition", {
// 									"bg-[var(--sidebar-menu-active-bg)] text-[var(--sidebar-menu-active-foreground)]": activeMenu === item.key,
// 									"hover:bg-gray-100 dark:hover:bg-gray-800": activeMenu !== item.key,
// 								})}
// 							>
// 								{item.icon}
// 								<span>{item.label}</span>
// 							</li>
// 						))}
// 					</ul>
// 				</nav>
// 			</aside>

// 			{/* Overlay for mobile */}
// 			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={onClose} />}
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
// 			<button onClick={() => setIsOpen((prev) => !prev)} className="text-xl focus:outline-none flex items-center gap-2">
// 				<Image src="/avatar.jpg" alt="User Avatar" width={45} height={45} className="rounded-full object-cover aspect-square" />
// 				<h4 className="text-sm font-semibold hidden sm:inline">Nama User</h4>
// 				<FaChevronDown className="text-xs" />
// 			</button>

// 			{isOpen && (
// 				<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-40">
// 					<ul className="text-sm text-gray-700">
// 						<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
// 						<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
// 					</ul>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// // const SearchBar = () => (
// // 	<div className="relative w-full max-w-sm">
// // 		<AppInput type="search" icon={<FaSearch />} />
// // 	</div>
// // );
// const SearchBar = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
// 	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		onChange(e.target.value);
// 	};

// 	return (
// 		<div className="relative w-full max-w-sm">
// 			<AppInput
// 				type="search"
// 				icon={<FaSearch />}
// 				value={value}
// 				onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
// 			/>
// 		</div>
// 	);
// };

// const AppDashboard: React.FC<AppDashboardProps> = ({ content, activeKey, onSearchChange }) => {
// 	const [sidebarOpen, setSidebarOpen] = useState(false);
// 	const [searchValue, setSearchValue] = useState("");

// 	const handleSearchChange = (value: string) => {
// 		setSearchValue(value);
// 		if (onSearchChange) {
// 			onSearchChange(value);
// 		}
// 	};

// 	useEffect(() => {
// 		const mediaQuery = window.matchMedia("(min-width: 768px)");
// 		setSidebarOpen(mediaQuery.matches);

// 		const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
// 		mediaQuery.addEventListener("change", handler);
// 		return () => mediaQuery.removeEventListener("change", handler);
// 	}, []);

// 	return (
// 		<div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
// 			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeMenu={activeKey} />

// 			<main
// 				className={clsx("flex-1 flex flex-col min-w-0", {
// 					"md:ml-64": sidebarOpen,
// 				})}
// 			>
// 				{/* Sticky Header */}
// 				<header className="sticky top-0 z-10 bg-[var(--surface)] border-b h-20 flex items-center gap-4 px-4">
// 					<button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 border rounded-lg shadow" aria-label="Toggle sidebar">
// 						<FaList />
// 					</button>

// 					{/* <SearchBar /> */}
// 					<SearchBar value={searchValue} onChange={handleSearchChange} />

// 					<div className="flex-1 flex justify-end">
// 						<UserDropdown />
// 					</div>
// 				</header>

// 				{/* Scrollable content */}
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
  onSearchChange?: (val: string) => void;
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
        className={clsx("fixed inset-y-0 left-0 w-64 border-r p-4 z-30 transition-transform duration-300 bg-[var(--surface)] text-[var(--foreground)]", {
          "-translate-x-full": !isOpen,
          "translate-x-0": isOpen,
        })}
      >
        <div className="flex justify-center items-center mb-5">
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
                  const path = item.key === "dashboard" ? `/${item.key}` : `/dashboard/${item.key}`;
                  router.push(path);
                  onClose();
                }}
                className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition", {
                  "bg-[var(--sidebar-menu-active-bg)] text-[var(--sidebar-menu-active-foreground)]": activeMenu === item.key,
                  "hover:bg-gray-100 dark:hover:bg-gray-800": activeMenu !== item.key,
                })}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={onClose} />}
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
      <button onClick={() => setIsOpen((prev) => !prev)} className="text-xl focus:outline-none flex items-center gap-2">
        <Image src="/avatar.jpg" alt="User Avatar" width={45} height={45} className="rounded-full object-cover aspect-square" />
        <h4 className="text-sm font-semibold hidden sm:inline">Nama User</h4>
        <FaChevronDown className="text-xs" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-40">
          <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full max-w-sm">
      <AppInput
        type="search"
        icon={<FaSearch />}
        value={value}
        onChange={handleChange}
        placeHolder="Search..."
      />
    </div>
  );
};

const AppDashboard: React.FC<AppDashboardProps> = ({ content, activeKey, onSearchChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setSidebarOpen(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeMenu={activeKey} />

      <main
        className={clsx("flex-1 flex flex-col min-w-0", {
          "md:ml-64": sidebarOpen,
        })}
      >
        <header className="sticky top-0 z-10 bg-[var(--surface)] border-b h-20 flex items-center gap-4 px-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 border rounded-lg shadow" aria-label="Toggle sidebar">
            <FaList />
          </button>

          <SearchBar value={searchValue} onChange={handleSearchChange} />

          <div className="flex-1 flex justify-end">
            <UserDropdown />
          </div>
        </header>

        <section className="flex-1 overflow-auto p-4 space-y-4">{content}</section>
      </main>
    </div>
  );
};

export default AppDashboard;