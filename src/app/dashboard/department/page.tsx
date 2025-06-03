/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
import React, { useEffect, useState } from "react";
import { CreateDepartmentEntity, DepartmentEntity } from "./entity/department_entity";
import AppDashboard from "@/components/dashboards/dashboard";
import IconCard from "@/components/cards/icon_card";
import { FaCog, FaListOl, FaPlus, FaTrash } from "react-icons/fa";
import AppTable, { ColumnProps } from "@/components/tables/table";
import { motion } from "framer-motion";
import AppForm, { FormField } from "@/components/inputs/AppForm";
import AppModal from "@/components/modal/app_modal";

const departmentUseCase = makeCrudUseCase<DepartmentEntity, CreateDepartmentEntity>("departments", {
	read: (res: any) => res.data,
	create: (res: any) => res.data,
	update: (res: any) => res.data,
	delete: (res: any) => ({ success: res.success }),
	upload: (res: any) => ({ success: res.success, image_url: res.image_url || "" }),
	search: (res: any) => res.data,
});

export default function Department() {
	const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<CreateDepartmentEntity>();
	const [selectedToDeleteId, setSelectedToDeleteId] = useState<number>(0);
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const columns: ColumnProps<DepartmentEntity>[] = [
		{ header: "Nama", accessor: (row) => <span className="text-sm">{row.name}</span> },
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-3 justify-center items-center">
					<motion.div
						className="icon-background cursor-pointer flex gap-2 items-center justify-center"
						onClick={() => {
							setSelectedDepartment(row);
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

	const formFields: FormField[] = [{ name: "name", label: "Nama", type: "text", placeholder: "Nama Departemen / Kategori" }];

	const handleCreateNewDepartment = async (data: any) => {
		setIsLoading(true);
		const dataToSubmit: CreateDepartmentEntity = {
			name: data.name,
		};
		try {
			await departmentUseCase.create(dataToSubmit);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			getAllDepartments();
		}
	};

	const getAllDepartments = async () => {
		setIsLoading(true);
		try {
			const res = await departmentUseCase.read();
			setDepartments(res);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateDepartment = async (data: any) => {
		setIsLoading(true);
		try {
			await departmentUseCase.update(data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			getAllDepartments();
		}
	};

	const handleDeleteDepartment = async () => {
		setIsLoading(true);
		try {
			await departmentUseCase.delete(selectedToDeleteId);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			getAllDepartments();
		}
	};

	useEffect(() => {
		getAllDepartments();
	}, []);

	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = async (query: string) => {
		try {
			let data;
			if (query.trim() === "") {
				data = await departmentUseCase.read();
			} else {
				data = await departmentUseCase.search(query);
			}
			setDepartments(data);
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
						<IconCard icon={<FaListOl size={24} />} title="Total Departemen / Kategori" value={departments.length} info={<></>} />
					</div>

					<AppTable
						data={departments}
						columns={columns}
						tableTitle="Tabel Departemen / Kategori"
						tools={
							<motion.div
								className="icon-background cursor-pointer"
								onClick={() => {
									setShowCreateModal(true);
								}}
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
						modalTitle="Tambah Departemen / Kategori"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleCreateNewDepartment(data);
							setShowCreateModal(false);
						}}
					/>

					<AppForm
						asModal
						isOpen={showEditModal}
						onClose={() => setShowEditModal(false)}
						modalTitle="Edit Departemen / Kategori"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={formFields}
						onSubmit={async (data) => {
							await handleUpdateDepartment(data);
							setShowEditModal(false);
						}}
						initialData={selectedDepartment}
					/>

					<AppModal
						isOpen={showDeleteModal}
						onClose={() => setShowDeleteModal(false)}
						onConfirm={async () => {
							await handleDeleteDepartment();
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
			activeKey={"department"}
		/>
	);
}
