"use client";
import AppInput from "@/components/inputs/AppInput";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { AuthUsecaseImpl } from "./usecase/implementation/auth_usecase_implementation";
import { AuthRepositoryImpl } from "./repository/implementation/auth_repository_implementation";
import { useRouter } from "next/navigation";
import AppLoading from "@/components/loading/AppLoading";

const usecase = new AuthUsecaseImpl(new AuthRepositoryImpl());

const LoginPage = () => {
	const router = useRouter();
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		phone: "",
		password: "",
		remember: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		setIsloading(true);
		e.preventDefault();
		try {
			const res = await usecase.login(formData.phone, formData.password);
			localStorage.setItem("token", res.token);
			router.push("/dashboard/report");
		} catch (error) {
			console.log("Terjadi kesalahan " + error);
		} finally {
			setIsloading(false);
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			router.push("/dashboard/report");
		}
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f5ff] to-[#f0ebff] dark:from-[#0a0612] dark:to-[#1a0f2d]">
			{isLoading && <AppLoading />}
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				transition={{ duration: 0.3 }}
				className="surface rounded-2xl p-8 w-full max-w-md shadow-2xl backdrop-blur-lg border border-[var(--border)] relative overflow-hidden"
			>
				<div className="absolute -top-20 -right-20 w-48 h-48 bg-[var(--primary)]/20 rounded-full blur-3xl" />
				<div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[var(--secondary)]/20 rounded-full blur-3xl" />

				<div className="text-center mb-8 relative z-10">
					<h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
						Selamat Datang
					</h1>
					<p className="text-sm text-[var(--disable)] mt-2">Silahkan login untuk melanjutkan</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6 relative z-10">
					<AppInput
						label="Nomor Telepon"
						type="number"
						placeHolder="0813xxxxxxxx"
						value={formData.phone}
						onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
					/>

					<AppInput
						label="Password"
						type={showPassword ? "text" : "password"}
						placeHolder="••••••••"
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						icon={
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="text-[var(--disable)] hover:text-[var(--primary)] transition-colors"
							>
								{showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
							</button>
						}
					/>

					<div className="flex items-center justify-between">
						<label className="flex items-center space-x-2 text-sm cursor-pointer">
							<input
								type="checkbox"
								checked={formData.remember}
								onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
								className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] transition-all"
							/>
							<span className="hover:text-[var(--primary)] transition-colors">Remember me</span>
						</label>
						<a href="#" className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors underline underline-offset-4">
							Forgot Password?
						</a>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all font-semibold relative overflow-hidden"
					>
						<span className="relative z-10">Sign In</span>
						<div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
					</motion.button>
				</form>

				<p className="mt-8 text-center text-sm text-[var(--disable)] relative z-10">
					Copyright 2025 By{" "}
					<a href="#" className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium">
						Dinas Kesbangpol
					</a>
				</p>
			</motion.div>
		</div>
	);
};

export default LoginPage;
