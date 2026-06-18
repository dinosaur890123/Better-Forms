"use client";
import {use, useState} from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface FormField {
    id: string,
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
}

export default function FormEditor({params}: {params: Promise<{id: string}>}) {
    const resolvedParams = use(params);
    const formId = resolvedParams.id;

    const [fields, setFields] = useState<FormField[]>([
        {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "John Doe",
            required: true
        },
        {
            id: "email",
            type: "email",
            label: "Email address",
            placeholder: "test@example.com",
            required: true
        },
        {
            id: "rating",
            type: "rating",
            label: "Overall rating",
            placeholder: "Select a rating",
            required: false
        },
        {
            id: "comments",
            type: "textarea",
            label: "Additional Comments",
            placeholder: "Type your message here...",
            required: false
        }
    ]);

    const [selectedFieldId, setSelectedFieldId] = useState<string>("name");
    const selectedField = fields.find((f) => f.id === selectedFieldId);
    const updateSelectedField = (key: keyof FormField, value: any) => {
        setFields(fields.map((f) => (f.id === selectedFieldId ? {...f, [key]: value } : f)));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.leftHeader}>
                    <link href="/" className={styles.backButton}>Back</link>
                    <input type="text" className={styles.formTitleInput} defaultValue={formId === "product-feedback" ? "Product feedback survey" : "Custom form"}/>
                     <span className={styles.statusIndicator}>
                    <span className={styles.dot}></span>Draft Saved</span>
                </div>
                <div className={styles.rightHeader}></div>
            </header>
        </div>
    );
}
