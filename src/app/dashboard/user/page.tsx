"use client";
import AppDashboard from "@/components/dashboards/dashboard";
import AppTable, { ColumnProps } from "@/components/tables/table";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UserEntity } from "./domain/entity/user_entity";
import { UserUsecaseImpl } from "./domain/usecase/implementation/user_usecase_implementation";
import { UserRepositoryImpl } from "./domain/repository/implementation/user_repository_implementation";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";
import AppModal from "@/components/modal/app_modal";
import AppForm, { FormField } from "@/components/inputs/AppForm";

const userUsecase = new UserUsecaseImpl(new UserRepositoryImpl());

export default function User() {
	const [users, setUsers] = useState<UserEntity[]>([]);
	const [showAddUserModal, setShowAddUserModal] = useState(false);

	const columns: ColumnProps<UserEntity>[] = [
		{
			header: "Nama",
			accessor: (row) => (
				<div className="flex items-center gap-4">
					<Image src={row.image || "/avatar.jpg"} alt="" width={40} height={40} className="rounded-full object-cover" />
					<div className="flex gap-1 flex-col">
						<div className="text-sm font-semibold text-[var(--primary)] cursor-pointer">
							<h5>{row.name}</h5>
						</div>
						<div className="text-xs">
							<h5>{row.role === 3 ? "Super Admin" : row.role === 2 ? "Admin" : "Agen"}</h5>
						</div>
					</div>
				</div>
			),
		},
		{ header: "Email", accessor: (row) => <h5>{row.email}</h5> },
		{ header: "Telepon", accessor: (row) => <h5>{row.phone}</h5> },
		{ header: "Kecamatan", accessor: (row) => <h5>{row.district.name}</h5> },
		{ header: "Kelurahan", accessor: (row) => <h5>{row.village.name}</h5> },
		{
			header: "Aktif",
			accessor: (row) => (
				<h5>{row.active ? <span className="text-[var(--success)]">Ya</span> : <span className="text-[var(--disable)]">Tidak</span>}</h5>
			),
			textAlign: "center",
		},
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-3 justify-center items-center">
					<div className="icon-background cursor-pointer flex gap-2 items-center justify-center" onClick={() => console.log(row)}>
						<FaCog className="text-[var(--primary)]" /> <h5 className="text-xs">Edit</h5>
					</div>
					<div className="icon-background cursor-pointer flex gap-2 items-center justify-center" onClick={() => console.log(row)}>
						<FaTrash className="text-[var(--danger)]" /> <h5 className="text-xs">Hapus</h5>
					</div>
				</div>
			),
			textAlign: "center",
		},
	];

	const userFormFields: FormField[] = [
		{ name: "name", label: "Nama", type: "text", placeholder: "Nama Pengguna" },
		{ name: "email", label: "Email", type: "email", placeholder: "Email Pengguna" },
		{ name: "phone", label: "Telepon", type: "text", placeholder: "Telepon Pengguna" },
		{ name: "id_card", label: "NIK", type: "text", placeholder: "NIK Pengguna" },
		{ name: "password", label: "Kata Sandi", type: "password", placeholder: "Kata Sandi Pengguna" },
		{ name: "repassword", label: "Ulangi Kata Sandi", type: "password", placeholder: "Ulangi Kata Sandi Pengguna" },
	];

	const getAllData = async () => {
		try {
			const data = await userUsecase.getAllUsers();
			setUsers(data);
		} catch (err) {
			console.error("Gagal mengambil data user:", err);
		}
	};

	useEffect(() => {
		getAllData();
	}, []);

	return (
		<AppDashboard
			content={
				<div className="w-full h-full">
					<div>
						<AppTable
							data={users}
							columns={columns}
							tableTitle="Tabel User"
							tools={
								<div className="icon-background cursor-pointer" onClick={() => setShowAddUserModal(true)}>
									<FaPlus />
								</div>
							}
						/>
					</div>

					<AppModal
						isOpen={showAddUserModal}
						onClose={() => setShowAddUserModal(false)}
						title="Tambah User"
						confirmLabel="Tambah User"
						cancelLabel="Batal"
						onConfirm={() => {
							alert("Dikonfirmasi!");
							setShowAddUserModal(false);
						}}
					>
						<AppForm fields={userFormFields} onSubmit={() => console.log("first")} />
					</AppModal>
				</div>
			}
			activeKey={"user"}
		/>
	);
}
