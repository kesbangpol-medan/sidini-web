"use client";
import React from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import clsx from "clsx";

interface AppModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	title?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	children: React.ReactNode;
	width?: string; // optional custom width
	disableCloseOnOverlayClick?: boolean;
}

const AppModal: React.FC<AppModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Konfirmasi",
	confirmLabel = "OK",
	cancelLabel = "Batal",
	children,
	width = "max-w-lg",
	disableCloseOnOverlayClick = false,
}) => {
	if (typeof window === "undefined") return null;

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
			onClick={() => {
				if (!disableCloseOnOverlayClick) onClose();
			}}
		>
			<div
				className={clsx("relative w-full bg-[var(--surface)] text-[var(--foreground)] rounded-lg shadow-lg", width)}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button onClick={onClose} className="text-[var(--danger)] hover:opacity-70">
						<FaTimes />
					</button>
				</div>

				{/* Body */}
				<div className="p-4 overflow-auto" style={{
					maxHeight: "70vh"
				}}>{children}</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 p-4 border-t">
					{cancelLabel && (
						<button className="px-4 py-2 rounded bg-gray-200 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={onClose}>
							{cancelLabel}
						</button>
					)}

					{onConfirm && (
						<button className="px-4 py-2 rounded bg-[var(--primary)] text-white text-sm hover:opacity-90" onClick={onConfirm}>
							{confirmLabel}
						</button>
					)}
				</div>
			</div>
		</div>,
		document.body
	);
};

export default AppModal;
