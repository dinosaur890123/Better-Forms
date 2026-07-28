import {FormField} from "../types/form";

export function isBlank(field: FormField, value: unknown): boolean {
    if (field.type === "checkbox") return value !== true;
    if (Array.isArray(value)) return value.length === 0;

    return value === undefined;
}

export function validateAnswer(field: FormField, value: unknown): string|null {
    if (isBlank(field, value)) {
        return field.required ? `${field.label} is required` : null;
    }

    switch (field.type) {
        case "email":
            if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter only a valid email address";
            }
            break;
        case "rating":
            
    }
}