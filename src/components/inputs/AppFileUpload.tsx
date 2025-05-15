/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

interface AppFileUploadProps {
	label?: string;
	onFileSelect?: (file: File | null) => void;
}

const AppFileUpload: React.FC<AppFileUploadProps> = ({ label, onFileSelect }) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setSelectedFile(file);
		onFileSelect?.(file);
		if (file) {
			setPreviewUrl(URL.createObjectURL(file));
		} else {
			setPreviewUrl(null);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0] || null;
		setSelectedFile(file);
		onFileSelect?.(file);
		if (file) {
			setPreviewUrl(URL.createObjectURL(file));
		} else {
			setPreviewUrl(null);
		}
	};

	return (
		<div>
			{label && <label className="text-xs font-semibold">{label.toUpperCase()}</label>}
			<div
				className="border-2 border-gray-300 border-dashed rounded w-full p-2 text-gray-700 bg-sidebar flex flex-col items-center justify-center cursor-pointer"
				onClick={() => fileInputRef.current?.click()}
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
			>
				{previewUrl && <img src={previewUrl} alt="Preview" className="mb-2 max-w-1/4 h-auto" />}
				<div className="flex items-center gap-2">
					<FaCloudUploadAlt className="text-md text-gray-500" /> <span>Upload File</span>
				</div>
				{/* <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" /> */}
				<input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".png,.jpg,.jpeg,.gif,.pdf" />
			</div>
			{selectedFile && <p className="mt-2 text-sm">File dipilih: {selectedFile.name}</p>}
		</div>
	);
};

export default AppFileUpload;
