import clsx from "clsx";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { menuItems } from "../sidebar_menu";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	activeMenu?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeMenu = "" }) => {
	const router = useRouter();
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
					<Image src="/icon.png" alt="sidini icon" width={120} height={60} className="object-cover" />
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
									// onClose();
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

export default Sidebar;
