import http from "@/app/configs/http";
import { UserRepository } from "../user_repository";
import { CreateUserEntity, UserEntity } from "../../entity/user_entity";

export class UserRepositoryImpl implements UserRepository {
	async getAllUsers(): Promise<UserEntity[]> {
		const response = await http.get(`/users`);
		if (response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}

	async createUser(data: CreateUserEntity): Promise<UserEntity> {
		const response = await http.post(`/users`, data);
		if (response.status === 201 || response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Gagal membuat user...");
		}
	}
}