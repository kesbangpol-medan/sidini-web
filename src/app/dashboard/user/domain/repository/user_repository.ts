import { CreateUserEntity, UserDistrictEntity, UserEntity, UserVillageEntity } from "../entity/user_entity";

export interface UserRepository {
	getAllUsers(): Promise<UserEntity[]>;
	createUser(data: CreateUserEntity): Promise<UserEntity>;
	getAllDistrict(): Promise<UserDistrictEntity[]>;
	getAllVillage(district_id: number): Promise<UserVillageEntity[]>;
	uploadUserImage(file: FormData): Promise<{ image_url: string; success: boolean }>;
	editUser(data: CreateUserEntity): Promise<UserEntity>;
	deleteUser(id: number): Promise<{ success: boolean }>;
	search(query: string): Promise<UserEntity[]>;
	count(): Promise<{
		total_user: number;
		active: number;
		inactive: number;
	}>;
}
