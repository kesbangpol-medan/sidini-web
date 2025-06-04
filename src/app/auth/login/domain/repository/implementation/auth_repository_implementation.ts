import http from "@/configs/http";
import { AuthRepository } from "../auth_repository";
import { UserEntity } from "@/app/dashboard/user/domain/entity/user_entity";

export class AuthRepositoryImpl implements AuthRepository {
	async getMe(): Promise<UserEntity> {
		const response = await http.get("/users/me");
		if (response.status === 200) {
			return response.data.user;
		} else {
			throw new Error("Gagal memuat user...");
		}
	}
    
	async login(phone: string, password: string): Promise<{ token: string }> {
		const data = {
			phone: phone,
			password: password,
		};
		const response = await http.post(`/users/login`, data);
		if (response.status === 200) {
			return {
				token: response.data.token,
			};
		} else {
			throw new Error("Gagal membuat user...");
		}
	}
}
