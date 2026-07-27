export function formatAnswer(value: any, blank = "—"): string {
    if (value === undefined || value === null || value === "") return blank;
    if (typeof value === "boolean") return value ? "Yes":"No";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
}