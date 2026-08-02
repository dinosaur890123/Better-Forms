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
    url: {label: "Link", icon: "↗", group: "Text", defaultLabel: "Website", answerable: true},
    number: {label: "Number",icon: "123", group: "Text", defaultLabel: "Enter a number", answerable: true},
    choice: {label: "Multiple choice", icon: "◉", group: "Choices", defaultLabel: "Select an option", defaultOptions: ["Option 1","Option 2"], answerable: true},
    dropdown: {label: "Dropdown", icon: "▾", group: "Choices", defaultLabel: "Pick one", defaultOptions: ["Option 1","Option 2"], answerable: true},
    multiselect: {label: "Checkboxes", icon: "☑", group: "Choices", defaultLabel: "Select all that apply", defaultOptions: ["Option 1","Option 2"], answerable: true},
    checkbox:  {label: "Single checkbox", icon: "✓", group: "Choices", defaultLabel: "New checkbox option", answerable: true},
    rating: {label: "Rating", icon: "★", group: "Scale", defaultLabel: "Rate your experience", answerable: true},
    date: {label: "Date", icon: "▦", group: "Time", defaultLabel: "Pick a date", answerable: true},
    heading: {label: "Heading", icon: "H", group: "Layout",  defaultLabel: "Section heading", answerable: false},
    paragraph: {label: "Paragraph", icon: "¶", group: "Layout", defaultLabel: "Some text to explain", answerable: false},
}

export const FIELD_GROUPS = ["Text", "Choices", "Scale", "Time", "Layout"];