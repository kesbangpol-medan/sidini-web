/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useCallback, useEffect, useState, useRef } from "react";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaDownload, FaFileAlt, FaImage, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // TODO: uncomment saat dibutuhkan
import AppTable, { ColumnProps } from "@/components/tables/table";
import AppModal from "@/components/modal/app_modal";
import AppAlert from "@/components/alert/AppAlert";
import { motion } from "framer-motion";
import { ReportEntity } from "./entity/report_entity";
import AppButton from "@/components/buttons/AppButton";
import { DistrictEntity } from "../district/entity/district_entity";
import AppForm, { FormField } from "@/components/inputs/AppForm";
import { DepartmentEntity } from "../department/entity/department_entity";
import http from "@/configs/http";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import LineReportChart from "./components/LineChart";
import WeeklyLineChart from "./components/WeeklyLineChart";

const reportUseCase = makeCrudUseCase<ReportEntity, any>("reports", {
  read: (res: any) => res.data,
  search: (res: any) => res.data,
  count: (res: any) => res,
});

const districUseCase = makeCrudUseCase<DistrictEntity, any>("districts", {
  read: (res: any) => res.data,
});

const departmentUseCase = makeCrudUseCase<DepartmentEntity, any>("departments", {
  read: (res: any) => res.data,
});

const REPORT_CHART_LIMIT = 1000;

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
  const [districts, setDistricts] = useState<DistrictEntity[]>([]);
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [lineChartData, setLineChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "warning" | "info";
    isOpen: boolean;
  }>({ message: "", type: "info", isOpen: false });

  const showToast = useCallback((message: string, type: "error" | "success" | "warning" | "info" = "info") => {
    setToast({ message, type, isOpen: true });
  }, []);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    showToast("Menyiapkan export PDF...", "info");
    const html2pdf = (await import("html2pdf.js")).default;

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
      showToast("PDF berhasil diexport.", "success");
    } catch (error) {
      console.error("Gagal export PDF:", error);
      showToast("Gagal export PDF.", "error");
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
          <p className="text-xs text-muted-foreground">{row.address}</p>
        </div>
      ),
      wrap: true,
    },
    {
      header: "Departemen",
      accessor: (row) => <span className="text-sm">{row.department?.name}</span>,
    },
    {
      header: "Tanggal",
      accessor: (row) => <span className="text-sm">{new Date(row.date_time).toLocaleDateString()}</span>,
    },
    {
      header: "Dokumentasi",
      accessor: (row) => <div className="flex gap-2 justify-center">{row.images && row.images.length > 0 ? <motion.img key={row.images[0].id} src={`${imgLink}/${row.images[0].link}`} alt="Report documentation" className="h-12 w-12 object-cover rounded cursor-pointer" onClick={() => setSelectedImage(row.images[0].link)} whileHover={{ scale: 1.05 }} /> : <FaImage className="text-muted-foreground text-xl" />}</div>,
    },

    {
      header: "Detail",
      accessor: (row) => (
        <motion.button
          className="text-sm text-primary hover:underline"
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

  const exportFormFields: FormField[] = [
    {
      name: "district_id",
      label: "Kecamatan",
      type: "select",
      options: [{ value: "-", label: "Semua Kecamatan" }, ...districts.map((val) => ({ value: val.id.toString(), label: val.name }))],
    },
    {
      name: "department_id",
      label: "Kategori",
      type: "select",
      options: [{ value: "-", label: "Semua Kategori" }, ...departments.map((val) => ({ value: val.id.toString(), label: val.name }))],
    },
    {
      name: "start_date",
      label: "Dari Tanggal",
      type: "date",
    },
    {
      name: "end_date",
      label: "Sampai Tanggal",
      type: "date",
    },
  ];

  const countReport = useCallback(async () => {
    try {
      const res = await reportUseCase.count<{ count?: number; total?: number }>();
      setTotalReport(res.count ?? res.total ?? 0);
    } catch (error) {
      console.log(error);
      showToast("Gagal mengambil total laporan.", "error");
    }
  }, [showToast]);

  // Fungsi untuk mengambil semua laporan berdasarkan halaman
  const getAllReports = useCallback(async (page: number) => {
    // Jika halaman pertama, tampilkan loading
    if (page == 1) {
      setIsLoading(true);
      showToast("Memuat data laporan...", "info");
    }
    try {
      // Ambil data laporan dari API dengan relasi-relasi yang dibutuhkan
      const res = await reportUseCase.read(`reports?include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images&page=${page}&limit=${REPORT_CHART_LIMIT}&sort=created_at+desc`);
      // Tambahkan data baru ke daftar laporan yang sudah ada
      if (page === 1) {
        setReports(res);
        showToast("Data laporan berhasil dimuat.", "success");
      } else {
        setReports((prev) => [...prev, ...res]);
        showToast("Data laporan tambahan berhasil dimuat.", "success");
      }
    } catch (error) {
      // Tampilkan error jika gagal mengambil data
      console.error("Error fetching reports:", error);
      showToast("Gagal mengambil data laporan.", "error");
    } finally {
      // Matikan loading spinner
      setIsLoading(false);
    }
  }, [showToast]);

  // const exportreport = async () => {}
  const getAllDistricts = useCallback(async () => {
    try {
      const res = await districUseCase.read();
      setDistricts(res);
    } catch (error) {
      console.error("Error fetching reports:", error);
      showToast("Gagal mengambil data kecamatan.", "error");
    }
  }, [showToast]);

  const getAllCategorie = useCallback(async () => {
    try {
      const res = await departmentUseCase.read();
      setDepartments(res);
    } catch (error) {
      console.log(error);
      showToast("Gagal mengambil data kategori.", "error");
    }
  }, [showToast]);

  // Generate chart data dari laporan API berdasarkan tahun yang dipilih (Jan-Des)
  useEffect(() => {
    if (departments.length > 0) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const data = labels.map((label, monthIdx) => {
        const row: any = { month: label };
        departments.forEach((dep) => {
          row[dep.name] = reports.filter((report) => {
            const reportDate = new Date(report.date_time);
            return (
              report.department?.name === dep.name &&
              reportDate.getFullYear() === selectedYear &&
              reportDate.getMonth() === monthIdx
            );
          }).length;
        });
        return row;
      });
      setLineChartData(data as any);
    }
  }, [departments, reports, selectedYear]);

  const renderYearFilter = () => {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, index) => startYear + index
    );
    return (
      <select
        id="annual-chart-year-filter"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="text-sm border border-[var(--border-accent)] rounded-lg px-3 py-1.5 bg-[#1e293b] text-white focus:outline-none focus:shadow-[0_0_0_3px_var(--accent-purple-glow)] cursor-pointer transition-all duration-200 hover:border-[var(--accent-purple)]"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    );
  };


  // Ambil data laporan berdasarkan halaman saat currentPage berubah,
  // tetapi hanya jika tidak sedang dalam mode pencarian
  useEffect(() => {
    // Jika sedang mencari (ada search term), hentikan pemanggilan ini
    if (searchTerm.trim() !== "") return;

    // Panggil fungsi untuk mengambil data laporan
    getAllReports(currentPage);
    getAllDistricts();
    getAllCategorie();
    countReport();
  }, [countReport, currentPage, getAllCategorie, getAllDistricts, getAllReports, searchTerm]);

  // Fungsi untuk melakukan pencarian laporan berdasarkan kata kunci
  const handleSearch = useCallback(async (query: string) => {
    try {
      // Jika input kosong, tidak usah melakukan pencarian
      if (query.trim() === "") return;

      const res = await reportUseCase.read(
        `reports/search?q=${encodeURIComponent(query)}&include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images`
      );
      setReports(res);
      showToast(`Pencarian selesai. ${res.length} laporan ditemukan.`, "success");
    } catch (err) {
      // Tampilkan error jika gagal
      console.error("Gagal mengambil data:", err);
      showToast("Gagal mencari data laporan.", "error");
    }
  }, [showToast]);

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
      // Kembalikan currentPage ke halaman 1
      setCurrentPage(1);
      getAllReports(1);
    }
  }, [searchTerm, getAllReports]);

  const toDateString = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleExport = async (data: any) => {
    const params = new URLSearchParams();

    if (data.district_id > 0) {
      params.append("district_id", data.district_id);
    }

    if (data.department_id > 0) {
      params.append("department_id", data.department_id);
    }

    if (data.start_date) {
      const startDate = toDateString(data.start_date);
      if (startDate) params.append("start_date", startDate);
    }

    if (data.end_date) {
      const endDate = toDateString(data.end_date);
      if (endDate) params.append("end_date", endDate);
    }

    const queryString = params.toString();
    const url = queryString ? `/reporting/filter?${queryString}` : `/reporting/filter`;

    try {
      showToast("Menyiapkan export Excel...", "info");
      const res = await http.get(url);
      const jsonData = res.data.data;

      if (!jsonData || jsonData.length === 0) {
        showToast("Data tidak ditemukan untuk diexport.", "warning");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Laporan");

      // Definisikan header
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Tanggal", key: "tanggal", width: 15 },
        { header: "Judul", key: "judul", width: 30 },
        { header: "Subjek", key: "subjek", width: 30 },
        { header: "Alamat", key: "alamat", width: 30 },
        { header: "Kategori", key: "departemen", width: 25 },
        { header: "Kelurahan", key: "kelurahan", width: 25 },
        { header: "Lingkungan", key: "lingkungan", width: 20 },
        { header: "Kecamatan", key: "kecamatan", width: 25 },
        { header: "Latar Belakang", key: "latar_belakang", width: 25 },
        { header: "Deskripsi", key: "deskripsi", width: 25 },
        { header: "Langkah Penanganan", key: "langkah_penanganan", width: 25 },
      ];

      // Isi baris data
      jsonData.forEach((item: any) => {
        worksheet.addRow({
          id: item.id,
          tanggal: toDateString(item.date_time),
          judul: item.title,
          subjek: item.subject,
          alamat: item.address,
          departemen: item.department?.name || "-",
          kelurahan: item.sub_village?.village?.name || "-",
          lingkungan: item.sub_village?.name || "-",
          kecamatan: item.sub_village?.village?.district?.name || "-",
          latar_belakang: item.background || "-",
          deskripsi: item.description || "-",
          langkah_penanganan: item.handling_step || "-",
        });
      });

      // Generate file dan download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "laporan-export.xlsx");
      showToast("Excel berhasil diexport.", "success");
    } catch (error) {
      console.error("Gagal mengekspor data:", error);
      showToast("Gagal export Excel.", "error");
    }
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const laporanBulanIni = reports.filter((l) => {
    const d = new Date(l.date_time);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalLaporanBulanIni = laporanBulanIni.length;

  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const previousMonth = previousMonthDate.getMonth();
  const previousMonthYear = previousMonthDate.getFullYear();
  const totalLaporanBulanLalu = reports.filter((l) => {
    const d = new Date(l.date_time);
    return d.getMonth() === previousMonth && d.getFullYear() === previousMonthYear;
  }).length;
  const monthlyTrendPercent =
    totalLaporanBulanLalu === 0
      ? totalLaporanBulanIni > 0
        ? 100
        : 0
      : Math.round(((totalLaporanBulanIni - totalLaporanBulanLalu) / totalLaporanBulanLalu) * 100);
  const monthlyTrendLabel = monthlyTrendPercent > 0 ? "naik dari bulan lalu" : monthlyTrendPercent < 0 ? "turun dari bulan lalu" : "sama dengan bulan lalu";
  const monthlyTrendClass = monthlyTrendPercent >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400";

  const kecamatanUploadSet = new Set(
    laporanBulanIni
      .map((l) => l.sub_village?.village?.district?.name)
      .filter(Boolean)
  );
  const totalKecamatanUpload = kecamatanUploadSet.size;

  const totalKecamatanBelumUpload = Math.max(districts.length - totalKecamatanUpload, 0);

  return (
    <AppDashboard
      isLoading={isLoading}
      onSearchChange={(data) => setSearchTerm(data)}
      content={
        <div className="w-full h-full flex flex-col gap-4">
          <AppAlert
            message={toast.message}
            type={toast.type}
            isOpen={toast.isOpen}
            onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
            duration={3000}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IconCard 
              featured
              icon={<FaFileAlt size={18} />} 
              title="Total Laporan" 
              value={totalReport} 
              info={
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-white/70">akumulasi seluruh laporan</span>
                </div>
              } 
            />
            <IconCard 
              icon={<FaCalendarAlt size={18} />} 
              title="Total Laporan Bulan Ini" 
              value={totalLaporanBulanIni} 
              info={
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${monthlyTrendClass}`}>
                    {monthlyTrendPercent > 0 ? "+" : ""}
                    {monthlyTrendPercent}%
                  </span>
                  <span className="text-muted-foreground">{monthlyTrendLabel}</span>
                </div>
              } 
            />
            <IconCard 
              icon={<FaMapMarkerAlt size={18} />} 
              title="Kecamatan Upload" 
              value={totalKecamatanUpload} 
              actionHref="/dashboard/rekap-kecamatan?tab=uploaded"
              actionLabel="Lihat kecamatan yang sudah upload"
              info={
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-muted-foreground">sudah mengunggah laporan</span>
                </div>
              } 
            />
            <IconCard 
              icon={<FaMapMarkerAlt size={18} />} 
              title="Kecamatan Belum Upload" 
              value={totalKecamatanBelumUpload} 
              actionHref="/dashboard/rekap-kecamatan?tab=notUploaded"
              actionLabel="Lihat kecamatan yang belum upload"
              info={
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="flex items-center px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">Perhatian</span>
                  <span className="text-muted-foreground">kecamatan belum aktif</span>
                </div>
              } 
            />
          </div>

          <div className="w-full">
            <LineReportChart
              title={`Statistik Laporan Tahunan`}
              data={lineChartData}
              action={renderYearFilter()}
            />
          </div>

          <div className="w-full">
            <WeeklyLineChart departments={departments} reports={reports} />
          </div>

          <AppTable
            tools={
              <>
                <AppButton label="Export" icon={<FaDownload />} onClick={() => setShowExportModal(true)} />
              </>
            }
            data={reports}
            columns={columns}
            tableTitle="Daftar Laporan"
            pagination
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={10}
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
                  <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                    <td className="p-2 font-semibold w-1/3 border-r" style={{ borderColor: "var(--border)" }}>
                      Subjek
                    </td>
                    <td className="p-2">{selectedReport.subject}</td>
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
                      Kategori
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

                  <tr className="border-b align-top" style={{ borderColor: "var(--border)" }}>
                    <td className="p-2 font-semibold border-r align-top" style={{ borderColor: "var(--border)" }}>
                      Latar Belakang
                    </td>
                    <td className="p-2 whitespace-pre-line">{selectedReport.background || "Tidak ada deskripsi"}</td>
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
                            <motion.div key={image.id} className="aspect-square rounded-md overflow-hidden border hover:border-primary transition-colors cursor-pointer" style={{ borderColor: "var(--border)" }} whileHover={{ scale: 1.03 }}>
                              <img src={`${imgLink}/${image.link}`} alt="Dokumentasi" className="w-full h-full object-cover" onClick={() => setSelectedImage(image.link)} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-center text-muted-foreground">Tidak ada dokumentasi</div>
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

          {/* <AppModal
						title="Export Data"
						onConfirm={handleExport}
						confirmLabel="Export"
						isOpen={showExportModal}
						onClose={() => setShowExportModal(false)}
					>
						<AppForm fields={exportFormFields} onSubmit={() => console.log("first")} />
					</AppModal> */}
          <AppForm
            asModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            modalTitle="Export Data"
            modalConfirmLabel="Export"
            modalCancelLabel="Batal"
            fields={exportFormFields}
            onSubmit={async (data) => {
              await handleExport(data);
              setShowExportModal(false);
            }}
            // initialData={selectedUser}
          />
        </div>
      }
      activeKey={"report"}
    />
  );
}
