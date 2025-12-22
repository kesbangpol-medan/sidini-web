/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "../../http";
import { CrudRepository } from "../crud_repository";

export class CrudRepositoryImpl<T, CreateT> implements CrudRepository<T, CreateT> {
	constructor(
		private defaultPath: string,
		private defaultExtractor?: {
			create?: (data: any) => T;
			read?: (data: any) => T[];
			update?: (data: any) => T;
			delete?: (data: any) => { success: boolean };
			upload?: (data: any) => { success: boolean; image_url: string };
			search?: (data: any) => T[];
			// count?: (data: any) => { total: number; active: number; inactive: number };
			count?: (data: any) => T[];
		}
	) {}

	private resolvePath(pathOverride?: string): string {
		return pathOverride ?? this.defaultPath;
	}

	private extract<U>(data: any, extractor?: (data: any) => U, defaultExtractor?: (data: any) => U): U {
		if (extractor) return extractor(data);
		if (defaultExtractor) return defaultExtractor(data);
		return data;
	}

	async create(data: CreateT, pathOverride?: string, extractor?: (data: any) => T): Promise<T> {
		const path = this.resolvePath(pathOverride);
		const res = await http.post(path, data);
		return this.extract(res.data, extractor, this.defaultExtractor?.create);
	}

	async read(pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]> {
		const path = this.resolvePath(pathOverride);
		const res = await http.get(path);
		return this.extract(res.data, extractor, this.defaultExtractor?.read);
	}

	async update(data: CreateT, pathOverride?: string, extractor?: (data: any) => T): Promise<T> {
		const path = this.resolvePath(pathOverride);
		const res = await http.put(path, data);
		return this.extract(res.data, extractor, this.defaultExtractor?.update);
	}

	async delete(id: number, pathOverride?: string, extractor?: (data: any) => { success: boolean }): Promise<{ success: boolean }> {
		const path = `${this.resolvePath(pathOverride)}/${id}`;
		const res = await http.delete(path);
		return this.extract(res.data, extractor, this.defaultExtractor?.delete);
	}

	async upload(
		file: FormData,
		uploadPathOverride?: string,
		extractor?: (data: any) => { success: boolean; image_url: string }
	): Promise<{ success: boolean; image_url: string }> {
		const path = this.resolvePath(uploadPathOverride ?? `${this.defaultPath}/upload`);
		const res = await http.post(path, file, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return this.extract(res.data, extractor, this.defaultExtractor?.upload);
	}

	async search(query: string, pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]> {
		const path = this.resolvePath(pathOverride);
		// const res = await http.get(`${path}/search?q=${encodeURIComponent(query)}`);
		const res = await http.get(`${path}/search?q=${query}`);
		return this.extract(res.data, extractor, this.defaultExtractor?.search);
	}
	
	async count<R = any>(pathOverride?: string, extractor?: (data: any) => R): Promise<R> {
		const path = this.resolvePath(pathOverride ?? `${this.defaultPath}/count`);
		const res = await http.get(path);
		return this.extract(res.data, extractor, this.defaultExtractor?.count as (data: any) => R);
	}
}
