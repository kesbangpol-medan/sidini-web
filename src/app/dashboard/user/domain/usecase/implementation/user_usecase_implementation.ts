import { CreateUserEntity, UserDistrictEntity, UserEntity, UserVillageEntity } from "../../entity/user_entity";
import { UserRepository } from "../../repository/user_repository";
import { UserUsecase } from "../user_usecase";

export class UserUsecaseImpl implements UserUsecase {
	constructor(private repo: UserRepository) {}
	async count(): Promise<{ total_user: number; active: number; inactive: number; }> {
		try {
			const users = await this.repo.count();
			return users;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}
	async search(query: string): Promise<UserEntity[]> {
		try {
			const users = await this.repo.search(query);
			return users;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}
	async deleteUser(id: number): Promise<{ success: boolean; }> {
		try {
			const res = await this.repo.deleteUser(id);
			return res;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}
	async editUser(data: CreateUserEntity): Promise<UserEntity> {
		try {
			const users = await this.repo.editUser(data);
			return users;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}

	async uploadUserImage(file: FormData): Promise<{ image_url: string; success: boolean; }> {
		try {
			const res = await this.repo.uploadUserImage(file);
			return res;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}

	async getAllVillage(district_id: number): Promise<UserVillageEntity[]> {
		try {
			const villages = await this.repo.getAllVillage(district_id);
			return villages;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}
	
	async getAllDistrict(): Promise<UserDistrictEntity[]> {
		try {
			const districts = await this.repo.getAllDistrict();
			return districts;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}

	async createUser(data: CreateUserEntity): Promise<UserEntity> {
		try {
			const user = await this.repo.createUser(data);
			return user;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}

	async getAllUsers(): Promise<UserEntity[]> {
		try {
			const users = await this.repo.getAllUsers();
			return users;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			throw new Error("Tidak ada hasil ditemukan...");
		}
	}
}
