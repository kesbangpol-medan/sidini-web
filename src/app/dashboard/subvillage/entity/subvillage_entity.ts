export interface SubVillageEntity {
	id: number;
	village_id: number;
	village: Village;
	name: string;
}

interface Village {
	id: number;
	district_id: number;
	name: string;
}

export interface CreateSubVillageEntity {
	village_id: number;
	name: string;
}
