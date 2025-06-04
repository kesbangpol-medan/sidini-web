/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrudRepository } from "../../repository/crud_repository";
import { CrudUseCase } from "../crud_usecase";

export class CrudUseCaseImpl<T, CreateT> implements CrudUseCase<T, CreateT> {
	constructor(private repository: CrudRepository<T, CreateT>) {}

	create(data: CreateT, pathOverride?: string, extractor?: (data: any) => T): Promise<T> {
		return this.repository.create(data, pathOverride, extractor);
	}

	read(pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]> {
		return this.repository.read(pathOverride, extractor);
	}

	update(data: CreateT, pathOverride?: string, extractor?: (data: any) => T): Promise<T> {
		return this.repository.update(data, pathOverride, extractor);
	}

	delete(id: number, pathOverride?: string, extractor?: (data: any) => { success: boolean }): Promise<{ success: boolean }> {
		return this.repository.delete(id, pathOverride, extractor);
	}

	upload(
		file: FormData,
		uploadPathOverride?: string,
		extractor?: (data: any) => { success: boolean; image_url: string }
	): Promise<{ success: boolean; image_url: string }> {
		return this.repository.upload(file, uploadPathOverride, extractor);
	}

	search(query: string, pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]> {
		if (!this.repository.search) {
			return Promise.resolve([]);
		}
		return this.repository.search(query, pathOverride, extractor);
	}

	// count(pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]> {
	//   if (!this.repository.count) {
	//     return Promise.resolve([]);
	//   }
	//   return this.repository.count(pathOverride, extractor);
	// }

	count<R = any>(pathOverride?: string, extractor?: (data: any) => R): Promise<R> {
		if (!this.repository.count) {
			return Promise.reject(new Error("Count not implemented"));
		}
		return this.repository.count<R>(pathOverride, extractor);
	}
}
