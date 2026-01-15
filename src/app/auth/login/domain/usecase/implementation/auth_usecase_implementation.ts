import { UserEntity } from "@/app/dashboard/user/domain/entity/user_entity";
import { AuthRepository } from "../../repository/auth_repository";
import { AuthUsecase } from "../auth_usecase";

export class AuthUsecaseImpl implements AuthUsecase {
  constructor(private repo: AuthRepository) {}

  async getMe(): Promise<UserEntity> {
    try {
      const res = await this.repo.getMe();
      return res;
    } catch (error) {
      throw new Error("Autentikasi gagal");
    }
  }

  async login(phone: string, password: string): Promise<{ token: string }> {
    try {
      const res = await this.repo.login(phone, password);
      return res;
    } catch (error: any) {
      // Pass through the error message from repository
      throw error instanceof Error ? error : new Error(error?.message || "Autentikasi gagal");
    }
  }
}
