import { UserEntity } from "../entity/user_entity";


export interface UserRepository {
	getAllUsers(): Promise<UserEntity[]>;
}