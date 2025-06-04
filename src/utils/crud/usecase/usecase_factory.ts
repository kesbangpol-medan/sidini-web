/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrudRepositoryImpl } from "../repository/implementation/crud_repository_implementation";
import { CrudUseCase } from "./crud_usecase";
import { CrudUseCaseImpl } from "./implementation/crud_usecase_implementation";

export function makeCrudUseCase<T, CreateT>(
  path: string,
  defaultExtractor?: {
    create?: (data: any) => T;
    read?: (data: any) => T[];
    update?: (data: any) => T;
    delete?: (data: any) => { success: boolean };
    upload?: (data: any) => { success: boolean; image_url: string };
    search?: (data: any) => T[];
    count?: (data: any) => any;
  }
): CrudUseCase<T, CreateT> {
  const repo = new CrudRepositoryImpl<T, CreateT>(path, defaultExtractor);
  return new CrudUseCaseImpl<T, CreateT>(repo);
}
