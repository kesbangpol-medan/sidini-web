/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CrudUseCase<T, CreateT> {
    create(data: CreateT, pathOverride?: string, extractor?: (data: any) => T): Promise<T>;
    read(pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]>;
    update(data: CreateT, pathOverride?: string, extractor?: (data: any) => T): Promise<T>;
    delete(id: number, pathOverride?: string, extractor?: (data: any) => { success: boolean }): Promise<{ success: boolean }>;
    upload(file: FormData, uploadPathOverride?: string, extractor?: (data: any) => { success: boolean; image_url: string }): Promise<{ success: boolean; image_url: string }>;
  
    search(query: string, pathOverride?: string, extractor?: (data: any) => T[]): Promise<T[]>;
    count<R = any>(pathOverride?: string, extractor?: (data: any) => R): Promise<R>;
  }