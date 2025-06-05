/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useCallback, useEffect, useState } from "react";
import { CreateVillageEntity, VillageEntity } from "./entity/village_entity";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaCog, FaListOl, FaPlus, FaTrash } from "react-icons/fa";
import AppTable, { ColumnProps } from "@/components/tables/table";
import { motion } from "framer-motion";
import AppForm, { FormField } from "@/components/inputs/AppForm";
import AppModal from "@/components/modal/app_modal";
import { DistrictEntity } from "../district/entity/district_entity";

const villageUseCase = makeCrudUseCase<VillageEntity, CreateVillageEntity>("villages", {
	read: (res: any) => res.data,
	create: (res: any) => res.data,
	update: (res: any) => res.data,
	delete: (res: any) => ({ success: res.success }),
	search: (res: any) => res.data,
	count: (res: any) => res,
});

const districtUseCase = makeCrudUseCase<DistrictEntity, any>("districts", {
	read: (res: any) => res.data,
});

export default function Village() {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [villages, setVillages] = useState<VillageEntity[]>([]);
	const [totalVillage, setTotalVillage] = useState(0);
	const [districts, setDistricts] = useState<DistrictEntity[]>([]);
	const [selectedVillage, setSelectedVillage] = useState<CreateVillageEntity>();
	const [selectedToDeleteId, setSelectedToDeleteId] = useState<number>(0);
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState("");

	const columns: ColumnProps<VillageEntity>[] = [
		{
			header: "Nama Desa",
			accessor: (row) => <span className="text-sm">{row.name}</span>,
		},
		{
			header: "Kecamatan",
			accessor: (row) => {
				const district = districts.find((d) => d.id === row.district_id);
				return <span className="text-sm">{district?.name || "Unknown"}</span>;
			},
		},
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-3 justify-center items-center">
					<motion.div
						className="icon-background cursor-pointer flex gap-2 items-center justify-center"
						onClick={() => {
							setSelectedVillage({
								...row,
								district_id: row.district_id,
							});
							setSelectedVillage(row);
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
		},
		{
			name: "name",
			label: "Nama Desa",
			type: "text",
			placeholder: "Nama Desa/Kelurahan",
		},
	];

	const handleCreateNewVillage = async (data: any) => {
		setIsLoading(true);
		const dataToSubmit: CreateVillageEntity = {
			name: data.name,
			district_id: Number(data.district_id),
		};

		try {
			await villageUseCase.create(dataToSubmit);
		} finally {
			setIsLoading(false);
			getAllVillages(1);
		}
	};

	const getDistricts = async () => {
		try {
			const res = await districtUseCase.read();
			setDistricts(res);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const countVillage = async () => {
		try {
			const res = await villageUseCase.count();
			setTotalVillage(res.count);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getAllVillages = async (page: number) => {
		if (page == 1) {
			setIsLoading(true);
		}

		try {
			const res = await villageUseCase.read(`villages?sort=name+ASC&page=${page}&limit=10`);
			setVillages((prev) => [...prev, ...res]);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (searchTerm.trim() !== "") return;

		countVillage();
		getAllVillages(currentPage);
		getDistricts();
	}, [currentPage, searchTerm]);

	const handleUpdateVillage = async (data: any) => {
		setIsLoading(true);
		try {
			await villageUseCase.update({
				...data,
				district_id: Number(data.district_id),
			});
		} finally {
			setIsLoading(false);
			getAllVillages(1);
		}
	};

	const handleDeleteVillage = async () => {
		setIsLoading(true);
		try {
			await villageUseCase.delete(selectedToDeleteId);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			getAllVillages(1);
		}
	};

	const handleSearch = useCallback(async (query: string) => {
		try {
			let data;
			if (query.trim() === "") {
				data = await villageUseCase.read();
			} else {
				data = await villageUseCase.search(query);
			}
			setVillages(data);
		} catch (err) {
			console.error("Gagal mengambil data:", err);
		}
	}, []);

	useEffect(() => {
		if (searchTerm.trim() === "") return;

		const delayDebounce = setTimeout(() => {
			handleSearch(searchTerm);
		}, 1000);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm, handleSearch]);

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setVillages([]);
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
						<IconCard icon={<FaListOl size={24} />} title="Total Desa/Kelurahan" value={totalVillage} info={<></>} />
					</div>

					<AppTable
						data={villages}
						columns={columns}
						tableTitle="Tabel Desa/Kelurahan"
						onScrollBottom={() => {
							setCurrentPage((prev) => prev + 1);
						}}
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
						modalTitle="Tambah Desa/Kelurahan"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleCreateNewVillage(data);
							setShowCreateModal(false);
						}}
					/>

					<AppForm
						asModal
						isOpen={showEditModal}
						onClose={() => setShowEditModal(false)}
						modalTitle="Edit Desa/Kelurahan"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleUpdateVillage(data);
							setShowEditModal(false);
						}}
						initialData={selectedVillage}
					/>

					<AppModal
						isOpen={showDeleteModal}
						onClose={() => setShowDeleteModal(false)}
						onConfirm={async () => {
							await handleDeleteVillage();
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
			activeKey={"village"}
		/>
	);
}
