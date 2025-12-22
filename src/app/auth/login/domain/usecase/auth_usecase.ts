import { UserEntity } from "@/app/dashboard/user/domain/entity/user_entity"

export interface AuthUsecase {
    login(phone: string, password: string): Promise<{token: string}>
    getMe(): Promise<UserEntity>
}