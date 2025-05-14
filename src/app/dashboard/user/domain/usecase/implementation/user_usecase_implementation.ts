import { UserEntity } from "../../entity/user_entity";
import { UserRepository } from "../../repository/user_repository";
import { UserUsecase } from "../user_usecase";

export class UserUsecaseImpl implements UserUsecase {
	constructor(private repo: UserRepository) {}

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