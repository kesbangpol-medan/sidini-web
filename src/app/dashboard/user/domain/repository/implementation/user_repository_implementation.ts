import http from "@/app/configs/http";
import { UserRepository } from "../user_repository";
import { UserEntity } from "../../entity/user_entity";

export class UserRepositoryImpl implements UserRepository {
	async getAllUsers(): Promise<UserEntity[]> {
		const response = await http.get(`/users`);
		if (response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Tidak ada data ditemukan...");
		}
	}
}