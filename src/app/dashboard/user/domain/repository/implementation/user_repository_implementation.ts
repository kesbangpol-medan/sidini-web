import http from "@/configs/http";
import { UserRepository } from "../user_repository";
import { CreateUserEntity, UserDistrictEntity, UserEntity, UserVillageEntity } from "../../entity/user_entity";

export class UserRepositoryImpl implements UserRepository {
	async count(): Promise<{ total_user: number; active: number; inactive: number; }> {
		const response = await http.get(`/users/count`);
		if (response.status === 200) {
			return response.data.users;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}
	async search(query: string): Promise<UserEntity[]> {
		const response = await http.get(`/users/search?q=${query}`);
		if (response.status === 200) {
			return response.data.users;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}
	async deleteUser(id: number): Promise<{ success: boolean }> {
		try {
			const response = await http.delete(`/users/${id}`)
			return response.data
		} catch (error) {
			console.error("Gagal upload gambar:", error);
			return { success: false };
		}
	}

	async editUser(data: CreateUserEntity): Promise<UserEntity> {
		const response = await http.put(`/users`, data);
		if (response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Gagal membuat user...");
		}
	}
	async uploadUserImage(file: FormData): Promise<{ image_url: string; success: boolean }> {
		try {
			const response = await http.post(`/upload-user-image`, file, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 201 && response.data.success) {
				return {
					image_url: response.data.image_url,
					success: true,
				};
			} else {
				throw new Error("Upload gagal");
			}
		} catch (error) {
			console.error("Gagal upload gambar:", error);
			return {
				image_url: "",
				success: false,
			};
		}
	}

	async getAllVillage(district_id: number): Promise<UserVillageEntity[]> {
		const response = await http.get(`/villages?district_id=${district_id}`);
		if (response.status === 200) {
			return response.data.data;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}

	async getAllDistrict(): Promise<UserDistrictEntity[]> {
		const response = await http.get(`/districts`);
		if (response.status === 200) {
			return response.data.data;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}

	async getAllUsers(): Promise<UserEntity[]> {
		const response = await http.get(`/users`);
		if (response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}

	async createUser(data: CreateUserEntity): Promise<UserEntity> {
		const response = await http.post(`/users/register`, data);
		if (response.status === 201 || response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Gagal membuat user...");
		}
	}
}
