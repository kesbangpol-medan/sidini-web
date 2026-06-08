/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import AppDashboard from "@/components/dashboards/dashboard";
import AppModal from "@/components/modal/app_modal";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaChevronDown, FaArrowUp, FaExclamationTriangle, FaEye } from "react-icons/fa";
import { FaFileCircleCheck, FaFileCircleXmark } from "react-icons/fa6";
import { ReportEntity } from "../report/entity/report_entity";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import { DistrictEntity } from "../district/entity/district_entity";

const reportUseCase = makeCrudUseCase<ReportEntity, any>("reports", {
  read: (res: any) => res.data,
});

const districtUseCase = makeCrudUseCase<DistrictEntity, any>("districts", {
  read: (res: any) => res.data,
});

// Nama bulan Indonesia
const BULAN_INDO = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Tipe untuk rekap per kecamatan
interface RekapKecamatan {
  nama: string;
  totalLaporan: number;
  kategoriTerbanyak: string;
  terakhirUpload: string;
  kelurahanAktif: number;
  laporanList: ReportEntity[];
}

export default function RekapKecamatanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<ReportEntity[]>([]);
  const [districts, setDistricts] = useState<DistrictEntity[]>([]);
  const [activeTab, setActiveTab] = useState<"uploaded" | "notUploaded">("uploaded");
  const [showModal, setShowModal] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState<RekapKecamatan | null>(null);
  const [expandedReportId, setExpandedReportId] = useState<number | null>(null);

  // Tanggal saat ini
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const _headerBulan = `${BULAN_INDO[currentMonth]} ${currentYear}`;

  const getAllData = async () => {
    setIsLoading(true);
    try {
      const [reportData, districtData] = await Promise.all([
        reportUseCase.read("reports?include=Department&include=SubVillage&include=SubVillage.Village&include=SubVillage.Village.District&include=Images&limit=1000&sort=created_at+desc"),
        districtUseCase.read(),
      ]);
      setReports(reportData);
      setDistricts(districtData);
    } catch (error) {
      console.error("Gagal mengambil data rekap kecamatan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  // Filter laporan bulan ini
  const laporanBulanIni = useMemo(() => {
    return reports.filter((l) => {
      const d = new Date(l.date_time);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [currentMonth, currentYear, reports]);

  // Kelompokkan per kecamatan
  const rekapData = useMemo(() => {
    const map = new Map<string, ReportEntity[]>();
    laporanBulanIni.forEach((l) => {
      const kecName = l.sub_village?.village?.district?.name;
      if (kecName) {
        if (!map.has(kecName)) map.set(kecName, []);
        map.get(kecName)!.push(l);
      }
    });

    const sudahUpload: RekapKecamatan[] = [];
    const belumUpload: string[] = [];

    districts.forEach((district) => {
      const kec = district.name;
      const districtReports = map.get(kec) || [];
      if (districtReports.length > 0) {
        // Hitung kategori terbanyak
        const katCount: Record<string, number> = {};
        districtReports.forEach((r) => {
          const kat = r.department?.name || "Lainnya";
          katCount[kat] = (katCount[kat] || 0) + 1;
        });
        const kategoriTerbanyak = Object.entries(katCount).sort((a, b) => b[1] - a[1])[0][0];

        // Cari tanggal terakhir upload
        const sortedDates = districtReports
          .map((r) => new Date(r.date_time).getTime())
          .sort((a, b) => b - a);
        const terakhir = new Date(sortedDates[0]);
        const terakhirStr = terakhir.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const uniqueKelurahan = new Set(districtReports.map(r => r.sub_village?.village?.id).filter(Boolean));

        sudahUpload.push({
          nama: kec,
          totalLaporan: districtReports.length,
          kategoriTerbanyak,
          terakhirUpload: terakhirStr,
          kelurahanAktif: uniqueKelurahan.size,
          laporanList: districtReports,
        });
      } else {
        belumUpload.push(kec);
      }
    });

    return { sudahUpload, belumUpload };
  }, [districts, laporanBulanIni]);

  const totalSudah = rekapData.sudahUpload.length;
  const totalBelum = rekapData.belumUpload.length;

  const handleLihat = (kec: RekapKecamatan) => {
    setSelectedKecamatan(kec);
    setExpandedReportId(null);
    setShowModal(true);
  };

  const toggleExpand = (id: number) => {
    setExpandedReportId((prev) => (prev === id ? null : id));
  };

  return (
    <AppDashboard
      isLoading={isLoading}
      content={
        <div className="w-full h-full flex flex-col gap-6 font-sans">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Sudah Upload */}
            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-success-muted flex items-center justify-center shrink-0">
                <FaFileCircleCheck className="text-success text-3xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Kecamatan Upload</span>
                <span className="text-foreground font-bold text-4xl my-1">{totalSudah}</span>
                <div className="flex items-center text-success text-sm font-semibold gap-1.5">
                  <FaArrowUp className="text-xs rotate-45" />
                  <span>Sudah kirim laporan</span>
                </div>
              </div>
            </div>

            {/* Card Belum Upload */}
            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-danger-muted flex items-center justify-center shrink-0">
                <FaFileCircleXmark className="text-danger text-3xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Kecamatan Belum Upload</span>
                <span className="text-foreground font-bold text-4xl my-1">{totalBelum}</span>
                <div className="flex items-center text-danger text-sm font-semibold gap-1.5">
                  <FaExclamationTriangle className="text-xs" />
                  <span>Perlu perhatian</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Container */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg flex flex-col">
            
            {/* Tabs */}
            <div className="flex w-full border-b border-border">
              <button
                onClick={() => setActiveTab("uploaded")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors ${
                  activeTab === "uploaded"
                    ? "border-b-2 border-primary text-accent-foreground"
                    : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaCheckCircle className={activeTab === "uploaded" ? "text-accent-foreground" : "text-muted-foreground"} />
                Sudah Upload
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "uploaded" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {totalSudah}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("notUploaded")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors ${
                  activeTab === "notUploaded"
                    ? "border-b-2 border-primary text-accent-foreground"
                    : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaTimesCircle className={activeTab === "notUploaded" ? "text-accent-foreground" : "text-muted-foreground"} />
                Belum Upload
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "notUploaded" ? "bg-danger/20 text-danger" : "bg-muted text-muted-foreground"
                }`}>
                  {totalBelum}
                </span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              {activeTab === "uploaded" ? (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">NO</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">KECAMATAN</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">TOTAL LAPORAN</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">KATEGORI TERBANYAK</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">TERAKHIR UPLOAD</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider text-center">STATUS</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {rekapData.sudahUpload.map((kec, idx) => (
                        <motion.tr
                          key={kec.nama}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                        >
                          <td className="px-6 py-4 text-muted-foreground font-semibold">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-foreground font-bold text-base">{kec.nama}</span>
                              <span className="text-muted-foreground text-sm mt-0.5">{kec.kelurahanAktif} kelurahan active</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-primary font-bold text-lg">{kec.totalLaporan}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-foreground font-semibold">{kec.kategoriTerbanyak}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-muted-foreground font-medium">
                              {kec.terakhirUpload.replace(" ", "\n")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-muted text-success border border-success/20 font-bold text-xs"
                            >
                              <FaCheckCircle className="text-[10px]" /> Uploaded
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleLihat(kec)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-sm transition-colors cursor-pointer"
                            >
                              <FaEye className="text-xs" /> Lihat
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {rekapData.sudahUpload.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider w-20">NO</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">KECAMATAN</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">STATUS</th>
                      <th className="px-6 py-5 text-xs font-bold text-muted-foreground tracking-wider">KETERANGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {rekapData.belumUpload.map((kec, idx) => (
                        <motion.tr
                          key={kec}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-muted-foreground font-semibold">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <span className="text-foreground font-bold text-base">{kec}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger-muted text-danger border border-danger/30 font-bold text-xs">
                              <FaTimesCircle /> Belum
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-muted-foreground">Belum ada laporan bulan ini</span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {rekapData.belumUpload.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modal Detail Kecamatan */}
          <AppModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setExpandedReportId(null);
            }}
            title=""
            width="max-w-5xl"
            cancelLabel=""
          >
            {selectedKecamatan && (
              <div className="flex flex-col gap-5 text-foreground">
                {/* Modal Header */}
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{selectedKecamatan.nama}</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-success-muted text-success text-xs font-bold">
                    <FaCheckCircle /> Sudah Upload
                  </span>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-3 gap-4 text-center mt-2">
                  <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                    <p className="text-3xl font-bold text-primary">{selectedKecamatan.totalLaporan}</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider">Total Laporan</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                    <p className="text-lg font-bold text-foreground">{selectedKecamatan.kategoriTerbanyak}</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider">Kategori Terbanyak</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                    <p className="text-lg font-bold text-foreground">{selectedKecamatan.terakhirUpload}</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider">Terakhir Upload</p>
                  </div>
                </div>

                {/* Tabel laporan */}
                <div className="overflow-x-auto rounded-xl border border-border mt-2">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-background border-b border-border">
                        <th className="px-4 py-3 font-bold text-muted-foreground w-10"></th>
                        <th className="px-4 py-3 font-bold text-muted-foreground tracking-wider text-xs">JUDUL</th>
                        <th className="px-4 py-3 font-bold text-muted-foreground tracking-wider text-xs">KATEGORI</th>
                        <th className="px-4 py-3 font-bold text-muted-foreground tracking-wider text-xs">KELURAHAN</th>
                        <th className="px-4 py-3 font-bold text-muted-foreground tracking-wider text-xs">TANGGAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedKecamatan.laporanList.map((lap) => {
                        const isExpanded = expandedReportId === lap.id;
                        return (
                          <React.Fragment key={lap.id}>
                            <tr
                              onClick={() => toggleExpand(lap.id)}
                              className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer group"
                            >
                              <td className="px-4 py-3">
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-muted group-hover:bg-muted/80 transition-colors"
                                >
                                  <FaChevronDown className="text-[10px] text-muted-foreground" />
                                </motion.div>
                              </td>
                              <td className="px-4 py-3 font-bold text-foreground">{lap.title}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex px-2.5 py-1 rounded bg-info/10 text-info text-xs font-bold">
                                  {lap.department?.name || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground font-medium">
                                {lap.sub_village?.village?.name || "-"}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                                {new Date(lap.date_time).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                            </tr>

                            {/* Expanded Detail Row */}
                            <AnimatePresence>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={5} className="p-0 border-b border-border bg-muted/30">
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm bg-card p-6 rounded-xl border border-border shadow-inner">
                                          <DetailItem label="Judul" value={lap.title} />
                                          <DetailItem label="Subjek" value={lap.subject} />
                                          <DetailItem label="Kategori" value={lap.department?.name || "-"} />
                                          <DetailItem label="Kecamatan" value={lap.sub_village?.village?.district?.name || "-"} />
                                          <DetailItem label="Kelurahan" value={lap.sub_village?.village?.name || "-"} />
                                          <DetailItem label="Lingkungan" value={lap.sub_village?.name || "-"} />
                                          <DetailItem
                                            label="Tanggal"
                                            value={new Date(lap.date_time).toLocaleDateString("id-ID", {
                                              weekday: "long",
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            })}
                                          />
                                          <DetailItem label="Alamat" value={lap.address || "-"} />
                                          <div className="md:col-span-2">
                                            <DetailItem label="Deskripsi" value={lap.description || "-"} />
                                          </div>
                                          <div className="md:col-span-2">
                                            <DetailItem label="Latar Belakang" value={lap.background || "-"} />
                                          </div>
                                          {lap.handling_step && (
                                            <div className="md:col-span-2">
                                              <DetailItem label="Langkah Penanganan" value={lap.handling_step} />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </AppModal>
        </div>
      }
      activeKey="rekap-kecamatan"
    />
  );
}

// Sub-komponen untuk menampilkan detail item
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-foreground font-medium leading-relaxed">{value}</p>
    </div>
  );
}
