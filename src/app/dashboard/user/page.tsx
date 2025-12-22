/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppDashboard from "@/components/dashboards/dashboard";
import AppTable, { ColumnProps } from "@/components/tables/table";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CreateUserEntity, UserDistrictEntity, UserEntity, UserVillageEntity } from "./domain/entity/user_entity";
import { UserUsecaseImpl } from "./domain/usecase/implementation/user_usecase_implementation";
import { UserRepositoryImpl } from "./domain/repository/implementation/user_repository_implementation";
import { FaCog, FaMobile, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import AppForm, { FormField } from "@/components/inputs/AppForm";
import IconCard from "@/components/cards/icon_card";
import AppModal from "@/components/modal/app_modal";
import { motion } from "framer-motion";

const userUsecase = new UserUsecaseImpl(new UserRepositoryImpl());

export default function User() {
	const [users, setUsers] = useState<UserEntity[]>([]);
	const [selectedUser, setSelectedUser] = useState<CreateUserEntity>();
	const [selectedDeleteUserId, setSelectedDeleteUserId] = useState<number>(0);
	const [districts, setDistricts] = useState<UserDistrictEntity[]>([]);
	const [villages, setVillages] = useState<UserVillageEntity[]>([]);
	const [showAddUserModal, setShowAddUserModal] = useState(false);
	const [showEditUserModal, setShowEditUserModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [dataMode, setDataMode] = useState<string>("");
	const userImg = process.env.NEXT_PUBLIC_USER_IMG;
	const [userCount, setUserCount] = useState({
		active: 0,
		inactive: 0,
		total_user: 0,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const columns: ColumnProps<UserEntity>[] = [
		{
			header: "Nama",
			accessor: (row) => (
				<div className="flex items-center gap-4 mr-4">
					<Image
						src={row.image ? `${userImg}/${row.image}` : "/avatar.jpg"}
						alt=""
						width={40}
						height={40}
						className="rounded-full object-cover aspect-square"
					/>
					<div className="flex gap-1 flex-col">
						<div className="text-sm">
							<span>{row.name}</span>
						</div>
						<div className="text-xs text-[var(--disable)]">
							<span>{row.role === 3 ? "Super Admin" : row.role === 2 ? "Admin" : "Agen"}</span>
						</div>
					</div>
				</div>
			),
		},
		{
			header: "Kontak",
			accessor: (row) => (
				<div className="flex flex-col gap-1">
					<div className="text-sm flex gap-2 items-center">
						<FaMobile /> {row.phone}
					</div>
					<div className="text-xs text-[var(--disable)]">{row.email}</div>
				</div>
			),
		},
		{ header: "Kecamatan", accessor: (row) => <span className="text-sm">{row.district.name}</span> },
		{ header: "Kelurahan", accessor: (row) => <span className="text-sm">{(row.village && row.village.name && row.village.name) || "-"}</span> },
		{
			header: "Aktif",
			accessor: (row) => (
				<span>
					{row.active ? <span className="text-[var(--success)] text-sm">Ya</span> : <span className="text-[var(--disable)] text-sm">Tidak</span>}
				</span>
			),
			textAlign: "center",
		},
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-3 justify-center items-center">
					<motion.div
						className="icon-background cursor-pointer flex gap-2 items-center justify-center"
						onClick={() => {
							setSelectedUser({
								...row,
								role: row.role.toString(),
								district_id: row.district.id,
								village_id: row.village.id,
								active: row.active ? "true" : "false",
							});
							setDataMode("edit");
							setShowEditUserModal(true);
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
							setShowDeleteModal(true);
							setSelectedDeleteUserId(parseInt(row.id));
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

	const userFormFields: FormField[] = [
		{ name: "name", label: "Nama", type: "text", placeholder: "Nama Pengguna" },
		{ name: "email", label: "Email", type: "email", placeholder: "Email Pengguna" },
		{ name: "phone", label: "Telepon", type: "text", placeholder: "Telepon Pengguna" },
		{ name: "password", label: "Kata Sandi", type: "password", placeholder: "Kata Sandi Pengguna" },
		{ name: "repassword", label: "Ulangi Kata Sandi", type: "password", placeholder: "Ulangi Kata Sandi Pengguna" },
		...(dataMode === "edit"
			? [
					{
						name: "active",
						label: "Aktif",
						type: "select",
						options: [
							{ value: "true", label: "Aktif" },
							{ value: "false", label: "Tidak" },
						],
					} as FormField,
			  ]
			: []),
		{
			name: "role",
			label: "Role",
			type: "select",
			options: [
				{ value: "1", label: "Agen" },
				{ value: "2", label: "Admin" },
			],
		},
		{
			name: "district_id",
			label: "Kecamatan",
			type: "select",
			options: [{ value: "-", label: "-" }, ...districts.map((val) => ({ value: val.id.toString(), label: val.name }))],
			onChange: (val) => {
				handleGetVillage(val);
			},
		},
		{
			name: "village_id",
			label: "Kelurahan",
			type: "select",
			options: [{ value: "-", label: "-" }, ...villages.map((val) => ({ value: val.id.toString(), label: val.name }))],
		},
		{ name: "image", label: "Foto", type: "file", placeholder: "Foto Pengguna" },
	];

	const handleCreateUser = async (data: any) => {
		setIsLoading(true);
		try {
			if (data.image instanceof File) {
				const formData = new FormData();
				formData.append("image", data.image);
				const res = await userUsecase.uploadUserImage(formData);
				if (res.success) {
					data.image = res.image_url;
				}
			}
			data.role = parseInt(data.role);
			data.district_id = parseInt(data.district_id);
			data.village_id = parseInt(data.village_id);
			await userUsecase.createUser(data);
			getAllData();
			setDataMode("");
		} catch (error) {
			console.error("Gagal mengambil data user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditUser = async (data: any) => {
		setIsLoading(true);
		try {
			if (data.image instanceof File) {
				const formData = new FormData();
				formData.append("image", data.image);
				const res = await userUsecase.uploadUserImage(formData);
				if (res.success) {
					data.image = res.image_url;
				}
			}
			data.role = parseInt(data.role);
			data.district_id = parseInt(data.district_id);
			data.village_id = parseInt(data.village_id);
			data.active = data.active === "true" ? true : false;
			await userUsecase.editUser(data);
			getAllData();
			setDataMode("");
		} catch (error) {
			console.error("Gagal mengambil data user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			await userUsecase.deleteUser(selectedDeleteUserId).then(() => {
				getAllData();
			});
		} catch (error) {
			console.error("Gagal mengambil data user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGetVillage = async (district_id: string | number) => {
		setIsLoading(true);
		try {
			const id = typeof district_id === "string" ? parseInt(district_id) : district_id;
			const res = await userUsecase.getAllVillage(id);
			setVillages(res);
		} catch (error) {
			console.error("Gagal mengambil data user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getAllData = async () => {
		setIsLoading(true);
		try {
			const users = await userUsecase.getAllUsers();
			const districts = await userUsecase.getAllDistrict();
			const count = await userUsecase.count();
			setUsers(users);
			setDistricts(districts);
			setUserCount(count);
		} catch (err) {
			console.error("Gagal mengambil data user:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getAllData();
	}, []);

	useEffect(() => {
		if (selectedUser?.district_id) {
			handleGetVillage(selectedUser.district_id);
		}
	}, [selectedUser?.district_id]);

	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = async (query: string) => {
		try {
			let users;
			if (query.trim() === "") {
				users = await userUsecase.getAllUsers();
			} else {
				users = await userUsecase.search(query);
			}
			setUsers(users);
		} catch (err) {
			console.error("Gagal mengambil data user:", err);
		}
	};
	
	useEffect(() => {
		if (searchTerm.trim() === "") {
			getAllData();
		}
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
						<IconCard
							icon={<FaUsers size={24} />}
							title="Total User"
							value={userCount.total_user}
							info={
								<div className="flex flex-col gap-1">
									<div className="bg-success px-2 py-1 rounded-full text-xs font-semibold text-center">{userCount.active} Aktif</div>
									<div className="bg-danger px-2 py-1 rounded-full text-xs font-semibold text-center">{userCount.inactive} Nonaktif</div>
								</div>
							}
						/>
					</div>
					<AppTable
						data={users}
						columns={columns}
						tableTitle="Tabel User"
						tools={
							<motion.div
								className="icon-background cursor-pointer"
								onClick={() => {
									setDataMode("create");
									setShowAddUserModal(true);
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
						isOpen={showAddUserModal}
						onClose={() => setShowAddUserModal(false)}
						modalTitle="Tambah User"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={userFormFields}
						onSubmit={async (data) => {
							await handleCreateUser(data);
							setShowAddUserModal(false);
						}}
					/>

					<AppForm
						asModal
						isOpen={showEditUserModal}
						onClose={() => setShowEditUserModal(false)}
						modalTitle="Edit User"
						modalConfirmLabel="Simpan"
						modalCancelLabel="Batal"
						fields={userFormFields}
						onSubmit={async (data) => {
							await handleEditUser(data);
							setShowEditUserModal(false);
						}}
						initialData={selectedUser}
					/>

					<AppModal
						isOpen={showDeleteModal}
						onClose={() => setShowDeleteModal(false)}
						onConfirm={async () => {
							await handleDelete();
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
			activeKey={"user"}
		/>
	);
}
