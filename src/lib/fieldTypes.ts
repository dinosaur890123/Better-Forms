import {FieldType} from "../types/form";

export interface FieldMeta {
    label: string;
    icon: string;
    group: string;
    defaultLabel: string;
    defaultOptions?: string[];
    answerable: boolean;
}

export const FIELD_TYPES: Record<FieldType, FieldMeta> = {
    text: {label: "Short answer", icon: "T", group: "Text", defaultLabel: "New text question", answerable: true},
    textarea: {label: "Long answer", icon: "≡", group: "Text", defaultLabel: "Tell us some more", answerable: true},
    email: {label: "Email", icon: "@", group: "Text", defaultLabel: "New email question", answerable: true},
    url: {label: "Link", icon: "->", group: "Text", defaultLabel: "Website", answerable: true},
}