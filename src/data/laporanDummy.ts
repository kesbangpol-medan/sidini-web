/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportEntity } from "@/app/dashboard/report/entity/report_entity";

const kategoriList = ["Sosial Budaya", "Agama", "Ekonomi", "Politik", "Keamanan dan Pertahanan", "Ideologi"];
export const kecamatanList = ["Medan Maimun", "Medan Baru", "Medan Amplas", "Medan Area"];
const kelurahanList = ["Kelurahan Pusat", "Kelurahan Merdeka", "Kelurahan Damai", "Kelurahan Aman"];
const lingkunganList = ["Lingkungan I", "Lingkungan II", "Lingkungan III", "Lingkungan IV"];

export const laporanList: ReportEntity[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  user_id: 1,
  department_id: (i % kategoriList.length) + 1,
  department: { 
    id: (i % kategoriList.length) + 1, 
    name: kategoriList[i % kategoriList.length], 
    reports: null as any, created_at: "", updated_at: "", deleted_at: null 
  },
  sub_village_id: (i % lingkunganList.length) + 1,
  sub_village: {
    id: (i % lingkunganList.length) + 1,
    name: lingkunganList[i % lingkunganList.length],
    village_id: (i % kelurahanList.length) + 1,
    village: {
      id: (i % kelurahanList.length) + 1,
      name: kelurahanList[i % kelurahanList.length],
      district_id: (i % kecamatanList.length) + 1,
      district: { 
        id: (i % kecamatanList.length) + 1, 
        name: kecamatanList[i % kecamatanList.length], 
        villages: null as any, users: null as any, created_at: "", updated_at: "", deleted_at: null 
      },
      sub_villages: null as any, users: null as any, created_at: "", updated_at: "", deleted_at: null
    },
    reports: null as any, created_at: "", updated_at: "", deleted_at: null
  },
  address: `Jl. Contoh No. ${i + 1}`,
  title: `Laporan ${i + 1}`,
  subject: `Subjek ${i + 1}`,
  background: `Latar belakang laporan nomor ${i + 1}`,
  description: `Deskripsi laporan nomor ${i + 1} terkait ${kategoriList[i % kategoriList.length]}`,
  handling_step: `Penanganan laporan ${i + 1}`,
  images: [],
  date_time: new Date(2026, i % 12, (i % 28) + 1).toISOString(),
  created_at: new Date(2026, i % 12, (i % 28) + 1).toISOString(),
  updated_at: new Date(2026, i % 12, (i % 28) + 1).toISOString(),
  deleted_at: null,
}));
