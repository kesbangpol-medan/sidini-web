import { UserEntity } from "@/app/dashboard/user/domain/entity/user_entity";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

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

export default UserDropdown;
