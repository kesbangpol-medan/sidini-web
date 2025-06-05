export interface ReportEntity {
	id: number;
	user_id: number;
	department_id: number;
	department: DepartmentEntity;
	sub_village_id: number;
	sub_village: SubVillageEntity;
	address: string;
	title: string;
	subject: string;
	background: string;
	description: string;
	handling_step: string;
	images: ReportImage[];
	date_time: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface ReportImage {
	id: number;
	link: string;
	report_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface DepartmentEntity {
	id: number;
	name: string;
	reports: null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface SubVillageEntity {
	id: number;
	name: string;
	village_id: number;
	village: VillageEntity;
	reports: null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface VillageEntity {
	id: number;
	name: string;
	district_id: number;
	district: DistrictEntity;
	sub_villages: null;
	users: null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface DistrictEntity {
	id: number;
	name: string;
	villages: null;
	users: null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}
