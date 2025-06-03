/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useEffect, useState } from "react";
import { CreateDistrictEntity, DistrictEntity } from "./entity/district_entity";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaCog, FaListOl, FaPlus, FaTrash } from "react-icons/fa";
import AppTable, { ColumnProps } from "@/components/tables/table";
import { motion } from "framer-motion";
import AppForm, { FormField } from "@/components/inputs/AppForm";
import AppModal from "@/components/modal/app_modal";

const districtUseCase = makeCrudUseCase<DistrictEntity, CreateDistrictEntity>("districts", {
	read: (res: any) => res.data,
	create: (res: any) => res.data,
	update: (res: any) => res.data,
	delete: (res: any) => ({ success: res.success }),
	upload: (res: any) => ({ success: res.success, image_url: res.image_url || "" }),
	search: (res: any) => res.data,
});

export default function District() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [districts, setDistricts] = useState<DistrictEntity[]>([]);
	const [selectedDistrict, setSelectedDistrict] = useState<CreateDistrictEntity>();
	const [selectedToDeleteId, setSelectedToDeleteId] = useState<number>(0);
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const columns: ColumnProps<DistrictEntity>[] = [
		{ header: "Nama", accessor: (row) => <span className="text-sm">{row.name}</span> },
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-3 justify-center items-center">
					<motion.div
						className="icon-background cursor-pointer flex gap-2 items-center justify-center"
						onClick={() => {
							setSelectedDistrict(row);
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
			name: "name",
			label: "Nama",
			type: "text",
			placeholder: "Nama Kecamatan",
		},
	];

	const handleCreateNewDistrict = async (data: any) => {
		setIsLoading(true);
		const dataToSubmit: CreateDistrictEntity = {
			name: data.name,
		};
		try {
			await districtUseCase.create(dataToSubmit);
		} finally {
			setIsLoading(false);
			getAllDistricts();
		}
	};

	const getAllDistricts = async () => {
		setIsLoading(true);
		try {
			// const res = await districtUseCase.read("districts?page=1&limit=10");
			const res = await districtUseCase.read();
			setDistricts(res);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateDistrict = async (data: any) => {
		setIsLoading(true);
		try {
			await districtUseCase.update(data);
		} catch {
			console.log("Update gagal");
		} finally {
			setIsLoading(false);
			getAllDistricts();
		}
	};

	const handleDeleteDistrict = async () => {
		try {
			await districtUseCase.delete(selectedToDeleteId);
		} catch {
			console.log("gagal");
		} finally {
			setIsLoading(false);
			getAllDistricts();
		}
	};

	useEffect(() => {
		getAllDistricts();
	}, []);

	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = async (query: string) => {
		try {
			let data;
			if (query.trim() === "") {
				data = await districtUseCase.read();
			} else {
				data = await districtUseCase.search(query);
			}
			setDistricts(data);
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
		isLoading={isLoading}
			onSearchChange={(data) => setSearchTerm(data)}
			content={
				<div className="w-full h-full flex flex-col gap-4">
					<div className="grid md:grid-cols-4">
						<IconCard icon={<FaListOl size={24} />} title="Total Kecamatan" value={districts.length} info={<></>} />
					</div>

					<AppTable
						data={districts}
						columns={columns}
						tableTitle="Tabel Kecamatan"
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
						modalTitle="Tambah Kecamatan"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleCreateNewDistrict(data);
							setShowCreateModal(false);
						}}
					/>

					<AppForm
						asModal
						isOpen={showEditModal}
						onClose={() => setShowEditModal(false)}
						modalTitle="Edit Kecamatan"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleUpdateDistrict(data);
							setShowEditModal(false);
						}}
						initialData={selectedDistrict}
					/>

					<AppModal
						isOpen={showDeleteModal}
						onClose={() => setShowDeleteModal(false)}
						onConfirm={async () => {
							await handleDeleteDistrict();
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
			activeKey={"district"}
		/>
	);
}
