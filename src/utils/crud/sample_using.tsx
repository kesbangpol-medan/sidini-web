// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
// import React, { useEffect, useState } from "react";
// import { makeCrudUseCase } from "@/utils/crud/usecase/usecase_factory";
// import { CreateDepartmentEntity, DepartmentEntity } from "./entity/department_entity";

// const departmentUseCase = makeCrudUseCase<DepartmentEntity, CreateDepartmentEntity>("departments", {
//     read: (res: any) => res.data,
//     create: (res: any) => res.data,
//     update: (res: any) => res.data,
//     delete: (res: any) => ({ success: res.success }),
//     upload: (res: any) => ({ success: res.success, image_url: res.image_url || "" }),
//     search: (res: any) => res.data,
// });

// export default function Department() {
//     const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
//     // const [loading, setLoading] = useState(false);
//     // const [error, setError] = useState<string | null>(null);

//     // useEffect(() => {
//     // 	async function fetchDepartments() {
//     // 		setLoading(true);
//     // 		setError(null);
//     // 		try {
//     // 			const data = await departmentUseCase.read();
//     // 			setDepartments(data);
//     // 		} catch (err) {
//     // 			setError("Failed to load departments" + err);
//     // 		} finally {
//     // 			setLoading(false);
//     // 		}
//     // 	}

//     // 	fetchDepartments();
//     // }, []);

//     useEffect(() => {
//         async function testSearch() {
//             try {
//                 const data = await departmentUseCase.read();
//                 console.log("Hasil search:", data);
//                 setDepartments(data);
//             } catch (err) {
//                 console.error("Gagal search:", err);
//             }
//         }
//         testSearch();
//     }, []);
    

//     // if (loading) return <div>Loading departments...</div>;
//     // if (error) return <div>{error}</div>;

//     return (
//         <div>
//             <h1>Departments</h1>
//             {departments.length === 0 ? (
//                 <p>No departments found.</p>
//             ) : (
//                 <ul>
//                     {departments.map((dept) => (
//                         <li key={dept.id}>
//                             <strong>{dept.name}</strong> (Created: {new Date(dept.created_at).toLocaleDateString()})
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }
