/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useEffect, useState } from "react";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaCog, FaListOl, FaPlus, FaTrash } from "react-icons/fa";
import AppTable, { ColumnProps } from "@/components/tables/table";
import { motion } from "framer-motion";
import AppForm, { FormField } from "@/components/inputs/AppForm";
import AppModal from "@/components/modal/app_modal";
import { CreateSubVillageEntity, SubVillageEntity } from "./entity/village_entity";
import { VillageEntity } from "../village/entity/village_entity";
import { DistrictEntity } from "../district/entity/district_entity";

const subVillageUseCase = makeCrudUseCase<SubVillageEntity, CreateSubVillageEntity>("sub-villages", {
	read: (res: any) => res.data,
	create: (res: any) => res.data,
	update: (res: any) => res.data,
	delete: (res: any) => ({ success: res.success }),
	search: (res: any) => res.data,
});
const districUseCase = makeCrudUseCase<DistrictEntity, any>("districts", {
	read: (res: any) => res.data,
});
const villageUseCase = makeCrudUseCase<VillageEntity, any>("villages", {
	read: (res: any) => res.data,
});

export default function SubVillage() {
	const [subVillages, setSubVillages] = useState<SubVillageEntity[]>([]);
	const [villages, setVillages] = useState<VillageEntity[]>([]);
	const [districts, setDistricts] = useState<DistrictEntity[]>([]);
	const [selectedSubVillage, setSelectedSubVillage] = useState<CreateSubVillageEntity>();
	const [selectedToDeleteId, setSelectedToDeleteId] = useState<number>(0);
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const columns: ColumnProps<SubVillageEntity>[] = [
		{
			header: "Nama Dusun/Lingkungan",
			accessor: (row) => <span className="text-sm">{row.name}</span>,
		},
		{
			header: "Desa/Kelurahan",
			accessor: (row) => <span className="text-sm">{row.village && row.village.name ? row.village.name : "Tidak terdaftar"}</span>,
		},
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-3 justify-center items-center">
					<motion.div
						className="icon-background cursor-pointer flex gap-2 items-center justify-center"
						onClick={() => {
							setSelectedSubVillage({
								...row,
								village_id: row.village_id,
							});
							setSelectedSubVillage(row);
							setShowEditModal(true);
						}}
						whileHover={{ scale: 1.05, translateY: -2 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<motion.span whileHover={{ rotate: 15 }}>
							<FaCog className="text-[var(--primary)]" />
						</motion.span>
						<h5 className="text-xs">Edit</h5>
					</motion.div>

					<motion.div
						className="icon-background cursor-pointer flex gap-2 items-center justify-center"
						onClick={() => {
							setSelectedToDeleteId(row.id);
							setShowDeleteModal(true);
						}}
						whileHover={{ scale: 1.05, translateY: -2 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<motion.span whileHover={{ scale: 1.2 }}>
							<FaTrash className="text-[var(--danger)]" />
						</motion.span>
						<h5 className="text-xs">Hapus</h5>
					</motion.div>
				</div>
			),
			textAlign: "center",
		},
	];

	const formFields: FormField[] = [
		{
			name: "district_id",
			label: "Kecamatan",
			type: "select",
			options: [{ value: "-", label: "-" }, ...districts.map((val) => ({ value: val.id.toString(), label: val.name }))],
			onChange: (val) => {
				getVillages(val);
			},
		},
		{
			name: "village_id",
			label: "Desa/Kelurahan",
			type: "select",
			options: [{ value: "-", label: "-" }, ...villages.map((val) => ({ value: val.id.toString(), label: val.name }))],
		},
		{
			name: "name",
			label: "Nama Dusun/Lingkungan",
			type: "text",
			placeholder: "Nama Dusun/Lingkungan",
		},
	];

	const handleCreateNewSubVillage = async (data: any) => {
		const dataToSubmit: CreateSubVillageEntity = {
			name: data.name,
			village_id: Number(data.village_id),
		};

		try {
			await subVillageUseCase.create(dataToSubmit);
		} finally {
			getAllSubVillages();
		}
	};

	const getAllSubVillages = async () => {
		try {
			const res = await subVillageUseCase.read("sub-villages?include=Village");
			setSubVillages(res);
		} catch (error) {
			console.log(error);
		}
	};

	const getVillages = async (district_id: number) => {
		try {
			const res = await villageUseCase.read(`villages?district_id=${district_id}`);
			setVillages(res);
		} catch (error) {
			console.log(error);
		}
	};

	const getDistricts = async () => {
		try {
			const res = await districUseCase.read();
			setDistricts(res);
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdateSubVillage = async (data: any) => {
		try {
			await subVillageUseCase.update({
				...data,
				village_id: Number(data.village_id),
			});
		} finally {
			getAllSubVillages();
		}
	};

	const handleDeleteSubVillage = async () => {
		try {
			await subVillageUseCase.delete(selectedToDeleteId);
		} finally {
			getAllSubVillages();
		}
	};

	useEffect(() => {
		getDistricts();
		getAllSubVillages();
	}, []);

	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = async (query: string) => {
		try {
			let data;
			if (query.trim() === "") {
				data = await subVillageUseCase.read();
			} else {
				data = await subVillageUseCase.search(`${query}&include=Village`);
			}
			setSubVillages(data);
		} catch (err) {
			console.error("Gagal mengambil data:", err);
		}
	};

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			handleSearch(searchTerm);
		}, 1000);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

	return (
		<AppDashboard
			onSearchChange={(data) => setSearchTerm(data)}
			content={
				<div className="w-full h-full flex flex-col gap-4">
					<div className="grid md:grid-cols-4">
						<IconCard icon={<FaListOl size={24} />} title="Total Dusun/Lingkungan" value={subVillages.length} info={<></>} />
					</div>

					<AppTable
						data={subVillages}
						columns={columns}
						tableTitle="Tabel Dusun/Lingkungan"
						tools={
							<motion.div
								className="icon-background cursor-pointer"
								onClick={() => setShowCreateModal(true)}
								whileHover={{ scale: 1.05, translateY: -2 }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<motion.span whileHover={{ rotate: 90 }}>
									<FaPlus className="text-[var(--primary)]" />
								</motion.span>
							</motion.div>
						}
					/>

					<AppForm
						asModal
						isOpen={showCreateModal}
						onClose={() => setShowCreateModal(false)}
						modalTitle="Tambah Dusun/Lingkungan"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleCreateNewSubVillage(data);
							setShowCreateModal(false);
						}}
					/>

					<AppForm
						asModal
						isOpen={showEditModal}
						onClose={() => setShowEditModal(false)}
						modalTitle="Edit Dusun/Lingkungan"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleUpdateSubVillage(data);
							setShowEditModal(false);
						}}
						initialData={selectedSubVillage}
					/>

					<AppModal
						isOpen={showDeleteModal}
						onClose={() => setShowDeleteModal(false)}
						onConfirm={async () => {
							await handleDeleteSubVillage();
							setShowDeleteModal(false);
						}}
						title="Yakin ingin menghapus data?"
						confirmLabel="Ya, hapus"
						cancelLabel="Batal"
						width="max-w-md"
						disableCloseOnOverlayClick={false}
					>
						<p>Data yang sudah dihapus tidak dapat dikembalikan. Lanjutkan?</p>
					</AppModal>
				</div>
			}
			activeKey={"subvillage"}
		/>
	);
}
