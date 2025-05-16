/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import AppInput from "./AppInput";
import AppDropdown from "./AppDropdown";
import AppFileUpload from "./AppFileUpload";
import AppButton from "../buttons/AppButton";
import AppMultipleSelect from "./AppMultipleSelect";
import AppDatePicker from "./AppDatePicker";
import AppModal from "../modal/app_modal"; // import modal

export interface FormField {
	name: string;
	label?: string;
	type?: "text" | "number" | "email" | "password" | "search" | "date" | "select" | "textarea" | "file" | "multiple-select" | "date";
	placeholder?: string;
	options?: { value: string; label: string }[];
	canCreate?: boolean;
	onCreate?: () => void;
	maxLength?: number;
	onChange?: (value: any) => void;
}

interface AppFormProps {
	fields: FormField[];
	onSubmit: (values: Record<string, any>) => void;
	className?: string;
	triggerSubmit?: (submit: () => void) => void;
	showSubmitButton?: boolean;
	submitButtonLabel?: string;
	initialData?: Record<string, any>;

	// Modal support
	asModal?: boolean;
	isOpen?: boolean;
	onClose?: () => void;
	modalTitle?: string;
	modalConfirmLabel?: string;
	modalCancelLabel?: string;
}

const AppForm: React.FC<AppFormProps> = ({
	fields,
	onSubmit,
	className,
	triggerSubmit,
	showSubmitButton,
	submitButtonLabel,
	initialData,

	asModal = false,
	isOpen = false,
	onClose,
	modalTitle = "Formulir",
	modalConfirmLabel = "Simpan",
	modalCancelLabel = "Batal",
}) => {
	const [formValues, setFormValues] = useState<Record<string, any>>(initialData || {});

	useEffect(() => {
		if (initialData) {
			setFormValues(initialData);
		}
	}, [initialData]);

	const handleChange = (name: string, value: any) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		onSubmit(formValues);
		setFormValues(initialData || {});
	};

	// Expose handleSubmit to parent if requested
	if (triggerSubmit) {
		triggerSubmit(handleSubmit);
	}

	const formContent = (
		<form onSubmit={handleSubmit} className={`${className || ""} flex flex-col gap-2`}>
			{fields.map((field) => (
				<div key={field.name} className={`${["textarea", "multiple-select", "file"].includes(field.type || "") ? "col-span-3" : ""}`}>
					{field.type === "select" ? (
						<AppDropdown
							label={field.label}
							options={field.options || []}
							value={formValues[field.name] || ""}
							placeholder={field.placeholder}
							// onChange={(e) => handleChange(field.name, e.target.value)}
							onChange={(e) => {
								const value = e.target.value;
								handleChange(field.name, value);
								if (field.onChange) {
									field.onChange(value); // panggil jika ada
								}
							}}
							canCreate={field.canCreate}
							onCreate={field.onCreate}
						/>
					) : field.type === "file" ? (
						<AppFileUpload label={field.label} onFileSelect={(file) => handleChange(field.name, file)} />
					) : field.type === "multiple-select" ? (
						<AppMultipleSelect
							label={field.label}
							options={field.options || []}
							value={formValues[field.name] || []}
							onChange={(selectedValues) => handleChange(field.name, selectedValues)}
							onCreate={field.onCreate}
							canCreate={field.canCreate}
						/>
					) : field.type === "date" ? (
						<AppDatePicker
							label={field.label}
							value={formValues[field.name] ? new Date(formValues[field.name]) : null}
							onChange={(date) => handleChange(field.name, date)}
							placeholder={field.placeholder}
						/>
					) : (
						<AppInput
							label={field.label}
							type={field.type}
							value={formValues[field.name] || ""}
							maxLength={field.maxLength}
							placeHolder={field.placeholder}
							onChange={(e) => handleChange(field.name, e.target.value)}
						/>
					)}
				</div>
			))}

			{showSubmitButton && (
				<div className="flex justify-end mt-4">
					<AppButton label={submitButtonLabel || "SUBMIT"} fontSize="text-xs" onClick={handleSubmit} />
				</div>
			)}
		</form>
	);

	if (asModal) {
		return (
			<AppModal
				isOpen={isOpen}
				onClose={onClose || (() => {})}
				title={modalTitle}
				confirmLabel={modalConfirmLabel}
				cancelLabel={modalCancelLabel}
				onConfirm={handleSubmit}
			>
				{formContent}
			</AppModal>
		);
	}

	return <div className="w-full h-full">{formContent}</div>;
};

export default AppForm;
