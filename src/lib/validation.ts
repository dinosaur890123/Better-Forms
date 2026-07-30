import {FormField} from "../types/form";

export function isBlank(field: FormField, value: unknown): boolean {
    if (field.type === "checkbox") return value !== true;
    if (Array.isArray(value)) return value.length === 0;

    return value === undefined || value === null || value === "";
}

export function validateAnswer(field: FormField, value: unknown): string|null {
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

        case "choice": {
            if (typeof value !== "string" || !(field.options ?? []).includes(value)) {
                return "Select one of the available options";
            }
            break;
        }

        case "checkbox": {
            if (typeof value !== "boolean") return "Invalid value";
            break;
        }

        case "text": {
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