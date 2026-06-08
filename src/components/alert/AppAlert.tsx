"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiX, FiInfo, FiAlertTriangle } from "react-icons/fi";

interface AppAlertProps {
	message: string;
	type?: "error" | "success" | "warning" | "info";
	isOpen: boolean;
	onClose: () => void;
	duration?: number;
}

const AppAlert: React.FC<AppAlertProps> = ({
	message,
	type = "error",
	isOpen,
	onClose,
	duration = 5000,
}) => {
	// Auto close after duration
	useEffect(() => {
		if (isOpen && duration > 0) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [isOpen, duration, onClose]);

	if (!isOpen) return null;

	const typeStyles = {
		error: "bg-red-500/20 border-red-500/30 text-red-400",
		success: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
		warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
		info: "bg-blue-500/20 border-blue-500/30 text-blue-400",
	};

	const typeIcons = {
		error: FiAlertCircle,
		success: FiCheckCircle,
		warning: FiAlertTriangle,
		info: FiInfo,
	};

	const Icon = typeIcons[type];

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -20, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -20, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${typeStyles[type]} border rounded-2xl shadow-lg p-4 flex items-start gap-3 backdrop-blur-md`}
				>
					<Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium break-words">{message}</p>
					</div>
					<button
						onClick={onClose}
						className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
					>
						<FiX className="w-4 h-4" />
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AppAlert;
