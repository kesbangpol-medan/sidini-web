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
		error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
		success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
		warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
		info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
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
					className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${typeStyles[type]} border rounded-lg shadow-lg p-4 flex items-start gap-3`}
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
