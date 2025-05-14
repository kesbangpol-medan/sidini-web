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

interface UserDistrictEntity {
	id: number;
	name: string;
}

interface UserVillageEntity {
	id: number;
	name: string;
}
