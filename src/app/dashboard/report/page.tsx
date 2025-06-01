/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useCallback, useEffect, useState } from "react";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaAlignLeft, FaBuilding, FaCalendar, FaCamera, FaFileAlt, FaImage, FaMapMarker, FaTasks } from "react-icons/fa";
import AppTable, { ColumnProps } from "@/components/tables/table";
import AppModal from "@/components/modal/app_modal";
import { motion } from "framer-motion";
import { ReportEntity } from "./entity/report_entity";
import Image from "next/image";

const reportUseCase = makeCrudUseCase<ReportEntity, any>("reports", {
	read: (res: any) => res.data,
	search: (res: any) => res.data,
});

export default function ReportsPage() {
	const [reports, setReports] = useState<ReportEntity[]>([]);
	const [selectedReport, setSelectedReport] = useState<ReportEntity | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const imgLink = process.env.NEXT_PUBLIC_IMG;

	const columns: ColumnProps<ReportEntity>[] = [
		{ header: "Judul", accessor: (row) => <span className="text-sm">{row.title}</span>, wrap: true },
		{
			header: "Lokasi",
			accessor: (row) => (
				<div className="text-sm">
					<p>{`KEC. ${row.sub_village.village.district.name}, KEL. ${row.sub_village.village.name}, LK. ${row.sub_village?.name}`}</p>
					<p className="text-xs text-gray-500">{row.address}</p>
				</div>
			),
			wrap: true,
		},
		{ header: "Departemen", accessor: (row) => <span className="text-sm">{row.department?.name}</span> },
		{ header: "Tanggal", accessor: (row) => <span className="text-sm">{new Date(row.date_time).toLocaleDateString()}</span> },
		{
			header: "Dokumentasi",
			accessor: (row) => (
				<div className="flex gap-2">
					{row.images && row.images.length > 0 ? (
						<motion.img
							key={row.images[0].id}
							src={`${imgLink}/${row.images[0].link}`}
							alt="Report documentation"
							className="h-12 w-12 object-cover rounded cursor-pointer"
							onClick={() => setSelectedImage(row.images[0].link)}
							whileHover={{ scale: 1.05 }}
						/>
					) : (
						<FaImage className="text-gray-400 text-xl" />
					)}
				</div>
			),
		},

		{
			header: "Detail",
			accessor: (row) => (
				<motion.button
					className="text-sm text-blue-500 hover:underline"
					onClick={() => {
						setSelectedReport(row);
						setShowDetailModal(true);
					}}
					whileHover={{ scale: 1.05 }}
				>
					Lihat Detail
				</motion.button>
			),
			textAlign: "center",
		},
	];

	const getAllReports = async () => {
		try {
			const res = await reportUseCase.read(
				"reports?include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images"
			);
			setReports(res);
		} catch (error) {
			console.error("Error fetching reports:", error);
		}
	};

	useEffect(() => {
		getAllReports();
	}, []);

	const renderDetailRow = (label: string, value?: string) => (
		<div className="flex gap-2 items-start">
			<span className="w-24" style={{ color: "var(--disable)" }}>
				{label}:
			</span>
			<span className="flex-1" style={{ color: "var(--foreground)" }}>
				{value || "Tidak ada data"}
			</span>
		</div>
	);

	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = useCallback(async (query: string) => {
		try {
			if (query.trim() === "") {
				// Kalau kosong, bisa abaikan karena di useEffect sudah getAllReports() langsung
				return;
			}

			const data = await reportUseCase.search(
				`${query}&include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images`
			);
			console.log(data);
			setReports(data);
		} catch (err) {
			console.error("Gagal mengambil data:", err);
		}
	}, []);

	useEffect(() => {
		if (searchTerm.trim() === "") {
			getAllReports();
		}

		const delayDebounce = setTimeout(() => {
			handleSearch(searchTerm);
		}, 1000);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm, handleSearch]);

	return (
		<AppDashboard
			onSearchChange={(data) => setSearchTerm(data)}
			content={
				<div className="w-full h-full flex flex-col gap-4">
					<div className="grid md:grid-cols-4">
						<IconCard icon={<FaFileAlt size={24} />} title="Total Laporan" value={reports.length} info={<></>} />
					</div>

					<AppTable data={reports} columns={columns} tableTitle="Daftar Laporan" />

					<AppModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Detail Laporan" width="max-w-4xl">
						{selectedReport && (
							<div className="space-y-6" style={{ color: "var(--foreground)" }}>
								{/* Header Section */}
								<div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: "var(--border)" }}>
									<div className="p-2 rounded-lg" style={{ backgroundColor: "var(--icon-bg)" }}>
										<FaFileAlt className="text-xl" style={{ color: "var(--primary)" }} />
									</div>
									<div>
										<h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
											{selectedReport.title}
										</h2>
										<div className="flex items-center gap-2 mt-1 text-sm" style={{ color: "var(--disable)" }}>
											<FaCalendar className="flex-shrink-0" />
											<span>
												{new Date(selectedReport.date_time).toLocaleDateString("id-ID", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
									</div>
								</div>

								{/* Main Content Grid */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{/* Left Column */}
									<div className="space-y-4">
										{/* Location Card */}
										<div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
											<div className="flex items-center gap-2 mb-3">
												<FaMapMarker className="text-primary" style={{ color: "var(--primary)" }} />
												<h3 className="font-semibold">Lokasi Kejadian</h3>
											</div>
											<div className="space-y-2 text-sm">
												{renderDetailRow("Kecamatan", selectedReport.sub_village?.village?.district?.name)}
												{renderDetailRow("Kelurahan", selectedReport.sub_village?.village?.name)}
												{renderDetailRow("Lingkungan", selectedReport.sub_village?.name)}
												{renderDetailRow("Alamat", selectedReport.address)}
											</div>
										</div>

										{/* Department Card */}
										<div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
											<div className="flex items-center gap-2 mb-3">
												<FaBuilding style={{ color: "var(--primary)" }} />
												<h3 className="font-semibold">Departemen Penanggung Jawab</h3>
											</div>
											<span className="text-sm" style={{ color: "var(--foreground)" }}>
												{selectedReport.department?.name || "Belum ditentukan"}
											</span>
										</div>
									</div>

									{/* Right Column */}
									<div className="space-y-4">
										{/* Description Card */}
										<div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
											<div className="flex items-center gap-2 mb-3">
												<FaAlignLeft style={{ color: "var(--primary)" }} />
												<h3 className="font-semibold">Deskripsi Lengkap</h3>
											</div>
											<p className="text-sm whitespace-pre-line" style={{ color: "var(--foreground)" }}>
												{selectedReport.description || "Tidak ada deskripsi"}
											</p>
										</div>

										{/* Handling Steps Card */}
										{selectedReport.handling_step && (
											<div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
												<div className="flex items-center gap-2 mb-3">
													<FaTasks style={{ color: "var(--primary)" }} />
													<h3 className="font-semibold">Langkah Penanganan</h3>
												</div>
												<div className="text-sm whitespace-pre-line" style={{ color: "var(--foreground)" }}>
													{selectedReport.handling_step}
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Documentation Section */}
								<div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
									<div className="flex items-center gap-2 mb-4">
										<FaCamera style={{ color: "var(--primary)" }} />
										<h3 className="font-semibold">Dokumentasi</h3>
									</div>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{selectedReport.images.length > 0 ? (
											selectedReport.images.map((image) => (
												<motion.div
													key={image.id}
													className="relative aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors"
													style={{ borderColor: "var(--border)" }}
													whileHover={{ scale: 1.02 }}
												>
													<img
														src={`${imgLink}/${image.link}`}
														alt="Dokumentasi laporan"
														className="object-cover cursor-pointer w-full h-full"
														onClick={() => setSelectedImage(image.link)}
														style={{ objectFit: "cover" }}
													/>
												</motion.div>
											))
										) : (
											<div className="col-span-full text-center py-6" style={{ color: "var(--disable)" }}>
												<FaImage className="text-3xl mx-auto mb-2" />
												<p className="text-sm">Tidak ada dokumentasi</p>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</AppModal>

					<AppModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Pratinjau Gambar" width="max-w-4xl">
						{selectedImage && (
							<Image src={`${imgLink}/${selectedImage}`} alt="Full preview" width={200} height={200} className="w-full h-auto max-h-[70vh] object-contain" />
						)}
					</AppModal>
				</div>
			}
			activeKey={"report"}
		/>
	);
}
