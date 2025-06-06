/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useCallback, useEffect, useState, useRef } from "react";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaFileAlt, FaImage } from "react-icons/fa";
import AppTable, { ColumnProps } from "@/components/tables/table";
import AppModal from "@/components/modal/app_modal";
import { motion } from "framer-motion";
import { ReportEntity } from "./entity/report_entity";
// import html2pdf from "html2pdf.js";

const reportUseCase = makeCrudUseCase<ReportEntity, any>("reports", {
	read: (res: any) => res.data,
	search: (res: any) => res.data,
	count: (res: any) => res,
});

export default function ReportsPage() {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [reports, setReports] = useState<ReportEntity[]>([]);
	const [selectedReport, setSelectedReport] = useState<ReportEntity | null>(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const imgLink = process.env.NEXT_PUBLIC_IMG;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [totalReport, setTotalReport] = useState<number>(0);
	const reportRef = useRef<HTMLTableElement>(null);
	
	const handleExportPDF = async () => {
		if (!reportRef.current) return;

		const html2pdf = (await import('html2pdf.js')).default;

		// Simpan style lama
		const originalBackground = reportRef.current.style.backgroundColor;
		const originalColor = reportRef.current.style.color;

		reportRef.current.style.backgroundColor = "#ffffff";
		reportRef.current.style.color = "#000000";

		// Simpan warna teks tiap elemen
		const elements = reportRef.current.querySelectorAll<HTMLElement>("*");
		const originalStyles: { el: HTMLElement; color: string }[] = [];
		elements.forEach((el) => {
			originalStyles.push({ el, color: el.style.color });
			el.style.color = "#000000";
		});

		// Temukan row dokumentasi gambar dengan cara yang lebih kompatibel
		let imageRow: HTMLTableRowElement | null = null;
		const rows = reportRef.current.querySelectorAll("tr");

		rows.forEach((row) => {
			const firstTd = row.querySelector("td");
			if (firstTd?.textContent?.includes("Dokumentasi Gambar")) {
				imageRow = row;
			}
		});

		if (imageRow && selectedReport!.images.length > 0) {
			// Buat row baru untuk link gambar
			const newRow = document.createElement("tr");
			newRow.className = "border-b";
			newRow.style.borderColor = "var(--border)";

			// Buat cell untuk label
			const labelCell = document.createElement("td");
			labelCell.className = "p-2 font-semibold border-r align-top";
			labelCell.style.borderColor = "var(--border)";
			labelCell.textContent = "Link Gambar";
			newRow.appendChild(labelCell);

			// Buat cell untuk link
			const linkCell = document.createElement("td");
			linkCell.className = "p-2";

			// Buat container untuk link
			const linksContainer = document.createElement("div");

			// Buat list link URL gambar
			const ul = document.createElement("ul");
			selectedReport!.images.forEach((image) => {
				const li = document.createElement("li");
				const a = document.createElement("a");
				a.href = `${imgLink}/${image.link}`;
				a.textContent = `${imgLink}/${image.link}`;
				a.style.color = "#007bff";
				a.style.textDecoration = "underline";
				a.target = "_blank";
				li.appendChild(a);
				ul.appendChild(li);
			});
			linksContainer.appendChild(ul);
			linkCell.appendChild(linksContainer);
			newRow.appendChild(linkCell);

			// Ganti row lama dengan row baru
			(imageRow as HTMLTableRowElement).parentNode?.replaceChild(newRow, imageRow as HTMLTableRowElement);
		}

		// Setup opsi html2pdf
		const opt = {
			margin: 0.5,
			filename: `${selectedReport!.title || "laporan"}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
		};

		try {
			await html2pdf().set(opt).from(reportRef.current).save();
		} catch (error) {
			console.error("Gagal export PDF:", error);
		} finally {
			// Restore style
			reportRef.current.style.backgroundColor = originalBackground;
			reportRef.current.style.color = originalColor;
			originalStyles.forEach(({ el, color }) => {
				el.style.color = color;
			});
		}
	};

	const columns: ColumnProps<ReportEntity>[] = [
		{ header: "Judul", accessor: (row) => <h5 className="text-sm">{row.title}</h5>, wrap: true },
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
				<div className="flex gap-2 justify-center">
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

	const countReport = async () => {
		try {
			const res = await reportUseCase.count();
			setTotalReport(res.count);
		} catch (error) {
			console.log(error);
		}
	};

	// Fungsi untuk mengambil semua laporan berdasarkan halaman
	const getAllReports = useCallback(async (page: number) => {
		// Jika halaman pertama, tampilkan loading
		if (page == 1) {
			setIsLoading(true);
		}
		try {
			// Ambil data laporan dari API dengan relasi-relasi yang dibutuhkan
			const res = await reportUseCase.read(
				`reports?include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images&page=${page}&limit=10`
			);
			// Tambahkan data baru ke daftar laporan yang sudah ada
			setReports((prev) => [...prev, ...res]);
		} catch (error) {
			// Tampilkan error jika gagal mengambil data
			console.error("Error fetching reports:", error);
		} finally {
			// Matikan loading spinner
			setIsLoading(false);
		}
	}, []);

	// Ambil data laporan berdasarkan halaman saat currentPage berubah,
	// tetapi hanya jika tidak sedang dalam mode pencarian
	useEffect(() => {
		// Jika sedang mencari (ada search term), hentikan pemanggilan ini
		if (searchTerm.trim() !== "") return;

		// Panggil fungsi untuk mengambil data laporan
		getAllReports(currentPage);
		countReport();
	}, [currentPage, getAllReports, searchTerm]);

	// Fungsi untuk melakukan pencarian laporan berdasarkan kata kunci
	const handleSearch = useCallback(async (query: string) => {
		try {
			// Jika input kosong, tidak usah melakukan pencarian
			if (query.trim() === "") return;

			// Panggil endpoint search dengan relasi yang dibutuhkan
			const data = await reportUseCase.search(
				`${query}&include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images`
			);
			// Ganti data laporan dengan hasil pencarian
			setReports(data);
		} catch (err) {
			// Tampilkan error jika gagal
			console.error("Gagal mengambil data:", err);
		}
	}, []);

	// Gunakan debounce saat user mengetik input pencarian
	useEffect(() => {
		// Jika input pencarian kosong, jangan lakukan apa-apa
		if (searchTerm.trim() === "") return;

		// Tunggu 1 detik setelah user berhenti mengetik baru lakukan pencarian
		const delayDebounce = setTimeout(() => {
			handleSearch(searchTerm);
		}, 1000);

		// Bersihkan timer saat searchTerm berubah sebelum 1 detik
		return () => clearTimeout(delayDebounce);
	}, [searchTerm, handleSearch]);

	// Reset daftar laporan dan halaman ke awal jika input pencarian dihapus
	useEffect(() => {
		// Jika search kosong, berarti user menghapus pencarian
		if (searchTerm.trim() === "") {
			// Kosongkan data laporan sebelumnya
			setReports([]);
			// Kembalikan currentPage ke halaman 1
			setCurrentPage(1);
		}
	}, [searchTerm]);

	return (
		<AppDashboard
			isLoading={isLoading}
			onSearchChange={(data) => setSearchTerm(data)}
			content={
				<div className="w-full h-full flex flex-col gap-4">
					<div className="grid md:grid-cols-4">
						<IconCard icon={<FaFileAlt size={24} />} title="Total Laporan" value={totalReport} info={<></>} />
					</div>

					<AppTable
						data={reports}
						columns={columns}
						tableTitle="Daftar Laporan"
						onScrollBottom={() => {
							setCurrentPage((prev) => prev + 1);
						}}
					/>

					<AppModal
						isOpen={showDetailModal}
						confirmLabel="EXPORT"
						onConfirm={async () => {
							await handleExportPDF();
							setShowDetailModal(false);
						}}
						onClose={() => setShowDetailModal(false)}
						title="Detail Laporan"
						width="max-w-4xl"
					>
						{selectedReport && (
							<table ref={reportRef} className="w-full table-fixed border-collapse">
								<tbody>
									{/* Judul */}
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold w-1/3 border-r" style={{ borderColor: "var(--border)" }}>
											Judul Laporan
										</td>
										<td className="p-2">{selectedReport.title}</td>
									</tr>

									{/* Tanggal */}
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r" style={{ borderColor: "var(--border)" }}>
											Tanggal
										</td>
										<td className="p-2">
											{new Date(selectedReport.date_time).toLocaleDateString("id-ID", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</td>
									</tr>

									{/* Lokasi */}
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r" style={{ borderColor: "var(--border)" }}>
											Kecamatan
										</td>
										<td className="p-2">{selectedReport.sub_village?.village?.district?.name || "-"}</td>
									</tr>
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r" style={{ borderColor: "var(--border)" }}>
											Kelurahan
										</td>
										<td className="p-2">{selectedReport.sub_village?.village?.name || "-"}</td>
									</tr>
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r" style={{ borderColor: "var(--border)" }}>
											Lingkungan
										</td>
										<td className="p-2">{selectedReport.sub_village?.name || "-"}</td>
									</tr>
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r" style={{ borderColor: "var(--border)" }}>
											Alamat
										</td>
										<td className="p-2">{selectedReport.address || "-"}</td>
									</tr>

									{/* Departemen */}
									<tr className="border-b" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r" style={{ borderColor: "var(--border)" }}>
											Departemen Penanggung Jawab
										</td>
										<td className="p-2">{selectedReport.department?.name || "Belum ditentukan"}</td>
									</tr>

									{/* Deskripsi */}
									<tr className="border-b align-top" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r align-top" style={{ borderColor: "var(--border)" }}>
											Deskripsi Lengkap
										</td>
										<td className="p-2 whitespace-pre-line">{selectedReport.description || "Tidak ada deskripsi"}</td>
									</tr>

									{/* Penanganan */}
									{selectedReport.handling_step && (
										<tr className="border-b align-top" style={{ borderColor: "var(--border)" }}>
											<td className="p-2 font-semibold border-r align-top" style={{ borderColor: "var(--border)" }}>
												Langkah Penanganan
											</td>
											<td className="p-2 whitespace-pre-line">{selectedReport.handling_step}</td>
										</tr>
									)}

									{/* Dokumentasi */}
									<tr className="align-top" style={{ borderColor: "var(--border)" }}>
										<td className="p-2 font-semibold border-r align-top" style={{ borderColor: "var(--border)" }}>
											Dokumentasi Gambar
										</td>
										<td className="p-2">
											{selectedReport.images.length > 0 ? (
												<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
													{selectedReport.images.map((image) => (
														<motion.div
															key={image.id}
															className="aspect-square rounded-md overflow-hidden border hover:border-primary transition-colors cursor-pointer"
															style={{ borderColor: "var(--border)" }}
															whileHover={{ scale: 1.03 }}
														>
															<img
																src={`${imgLink}/${image.link}`}
																alt="Dokumentasi"
																className="w-full h-full object-cover"
																onClick={() => setSelectedImage(image.link)}
															/>
														</motion.div>
													))}
												</div>
											) : (
												<div className="text-sm text-center text-gray-400">Tidak ada dokumentasi</div>
											)}
										</td>
									</tr>
								</tbody>
							</table>
						)}
					</AppModal>

					<AppModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Pratinjau Gambar" width="max-w-4xl">
						{selectedImage && <img src={`${imgLink}/${selectedImage}`} alt="Full preview" className="w-full h-auto max-h-[70vh] object-contain" />}
					</AppModal>
				</div>
			}
			activeKey={"report"}
		/>
	);
}
