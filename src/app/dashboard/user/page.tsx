"use client";
import AppDashboard from "@/components/dashboards/dashboard";
import AppTable, { ColumnProps } from "@/components/tables/table";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UserEntity } from "./domain/entity/user_entity";
import { UserUsecaseImpl } from "./domain/usecase/implementation/user_usecase_implementation";
import { UserRepositoryImpl } from "./domain/repository/implementation/user_repository_implementation";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";

const userUsecase = new UserUsecaseImpl(new UserRepositoryImpl());

export default function User() {
	const [users, setUsers] = useState<UserEntity[]>([]);

	const columns: ColumnProps<UserEntity>[] = [
		{
			header: "Nama",
			accessor: (row) => (
				<div className="flex items-center gap-4">
					<Image src={row.image || "/avatar.jpg"} alt="" width={40} height={40} className="rounded-full object-cover" />
					<div className="flex gap-2 flex-col">
						<div className="text-sm font-semibold">
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
		{ header: "Aktif", accessor: (row) => <h5>{row.active ? "Ya" : "Tidak"}</h5>, textAlign: "center" },
		{
			header: "Opsi",
			accessor: (row) => (
				<div className="w-full flex gap-4 justify-center items-center">
					<div className="icon-background cursor-pointer" onClick={() => console.log(row)}>
						<FaCog className="text-blue-400" />
					</div>
					<div className="icon-background cursor-pointer" onClick={() => console.log(row)}>
						<FaTrash className="text-red-400" />
					</div>
				</div>
			),
			textAlign: "center",
		},
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
								<div className="icon-background">
									<FaPlus />
								</div>
							}
						/>
					</div>
				</div>
			}
			activeKey={"user"}
		/>
	);
}
