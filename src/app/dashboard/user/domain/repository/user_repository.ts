import { CreateUserEntity, UserEntity } from "../entity/user_entity";

export interface UserRepository {
	getAllUsers(): Promise<UserEntity[]>;
	createUser(data: CreateUserEntity): Promise<UserEntity>;
}