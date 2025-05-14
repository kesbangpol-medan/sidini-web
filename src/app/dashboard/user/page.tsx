"use client";
import AppDashboard from "@/components/dashboards/dashboard";
import AppTable, { ColumnProps } from "@/components/tables/table";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UserEntity } from "./domain/entity/user_entity";
import { UserUsecaseImpl } from "./domain/usecase/implementation/user_usecase_implementation";
import { UserRepositoryImpl } from "./domain/repository/implementation/user_repository_implementation";

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
						<div className="text-sm font-semibold">{row.name}</div>
						<div className="text-xs">{row.role === 3 ? "Super Admin" : row.role === 2 ? "Admin" : "Agen"}</div>
					</div>
				</div>
			),
		},
		{ header: "Email", accessor: (row) => row.email },
		{ header: "Telepon", accessor: (row) => row.phone },
		{ header: "Kecamatan", accessor: (row) => row.district.name },
		{ header: "Kelurahan", accessor: (row) => row.village.name },
		{ header: "Aktif", accessor: (row) => (row.active ? "Ya" : "Tidak"), textAlign: "center" },
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
				<div>
					<div className="p-4">
						<AppTable data={users} columns={columns} tableTitle="Tabel User" />
					</div>
				</div>
			}
			activeKey={"user"}
		/>
	);
}
