export interface UserEntity {
	id: string;
	name: string;
	phone: string;
	email: string;
	active: boolean;
	role: number;
	image?: string;
	district: UserDistrictEntity;
	village: UserVillageEntity;
}

export interface UserDistrictEntity {
	id: number;
	name: string;
}

export interface UserVillageEntity {
	id: number;
	name: string;
}

export interface CreateUserEntity {
	name: string;
	phone: string;
	email: string;
	active: boolean | string;
	role: number | string;
	image?: string;
	district_id: number;
	village_id: number;
}