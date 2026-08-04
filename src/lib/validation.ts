import {FormField} from "../types/form";
import {FIELD_TYPES} from "./fieldTypes";

export function isBlank(field: FormField, value: unknown): boolean {
    if (field.type === "checkbox") return value !== true;
    if (Array.isArray(value)) return value.length === 0;

    return value === undefined || value === null || value === "";
}

export function validateAnswer(field: FormField, value: unknown): string|null {
    if (!FIELD_TYPES[field.type]?.answerable) return null;

    if (isBlank(field, value)) {
        return field.required ? `${field.label} is required` : null;
    }

    switch (field.type) {
        case "email": {
            if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter only a valid email address";
            }
            break;
        }
        case "rating": {
            const n = Number(value);
            if (!Number.isInteger(n) || n < 1 || n > 5) return "The rating must be between 1 and 5";
            break;
        }

        case "url": {
            if (typeof value !== "string" || !/^https?:\/\/\S+\.\S+/.test(value)) {
                return "Enter a link starting with http:// or https://";
            }
            break;
        }

        case "number": {
            const n = Number(value);
            if (!Number.isFinite(n)) return "Enter a number";
            const {min, max} = field.config;
            if (min !== undefined && n < min) return `Must be ${min} or more`;
            if (max !== undefined && n > max) return `Must be ${max} or less`;
            break;
        }

        case "date": {
            if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return "Enter a valid date";
            break;
        }

        case "multiselect": {
            if (!Array.isArray(value)) return "Invalid value";
            const allowed = field.options ?? [];
            if (!value.every((v) => typeof v === "string" && allowed.includes(v))) {
                return "Select only the available options";
            }
            break;
        }

        case "choice":
        case "dropdown": {
            if (typeof value !== "string" || !(field.options ?? []).includes(value)) {
                return "Select one of the available options";
            }
            break;
        }

        case "checkbox": {
            if (typeof value !== "boolean") return "Invalid value";
            break;
        }

        case "text":
        case "textarea": {
            if (typeof value !== "string") return "Invalid value";
            const {minLength, maxLength} = field.config;
            if (minLength && value.length < minLength) return `It must be at least ${minLength} characters`;

            if (maxLength && value.length > maxLength) return `Must be ${maxLength} characters or fewer`;
            break;
        }
    }
    return null;
}

export function validateAnswers(fields: FormField[], answers: Record<string, unknown>): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of fields) {
        const message = validateAnswer(field, answers[field.id]);
        if (message) errors[field.id] = message;
    }
    return errors;
}