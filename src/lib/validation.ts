import {FormField} from "../types/form";

export function isBlank(field: FormField, value: unknown): boolean {
    if (field.type === "checkbox") return value !== true;
    if (Array.isArray(value)) return value.length === 0;

    return value === undefined;
}