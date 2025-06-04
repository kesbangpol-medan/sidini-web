// app/components/menuItems.ts (atau tempat lain sesuai struktur project kamu)
import { BiCategory } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdAssessment, MdLocationCity } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";
import { TbTrees } from "react-icons/tb";
import { ReactNode } from "react";

export interface SidebarItem {
	key: string;
	label: string;
	icon: ReactNode;
}

export const menuItems: SidebarItem[] = [
	// { key: "dashboard", label: "Dashboard", icon: <BiGridAlt /> },
	{ key: "report", label: "Laporan", icon: <MdAssessment /> },
	{ key: "user", label: "User", icon: <FaUsers /> },
	{ key: "department", label: "Departemen / Kategori", icon: <BiCategory /> },
	{ key: "district", label: "Kecamatan", icon: <MdLocationCity /> },
	{ key: "village", label: "Kelurahan", icon: <RiHome2Line /> },
	{ key: "subvillage", label: "Lingkungan", icon: <TbTrees /> },
];
