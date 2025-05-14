import { UserEntity } from "../entity/user_entity";

export interface UserUsecase {
	getAllUsers(): Promise<UserEntity[]>;
}

