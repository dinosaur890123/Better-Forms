import React from "react";
import {Form} from "../types/form";
import styles from "../styles/FormPreview.module.css";
import {FIELD_TYPES} from "../lib/fieldTypes";
import FieldInput from "./fieldInput";
interface FormPreviewProps {
    form: Form;
    testResponses: Record<string, any>;
    onTestValueChange: (fieldId: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function FormPreview({
    form, testResponses, onTestValueChange, onSubmit
}: FormPreviewProps) {
    return (
        <div className={styles.testerPanel}>
            <div className={styles.panelHeader}>
                <h2>Test form preview</h2>
                <p>Submit responses to test form functionality.</p>
            </div>

        <form onSubmit={onSubmit} className={styles.testFormCard}>
            <h3 className={styles.testFormTitle}>{form.title}</h3>
        {form.fields.length === 0 ? (
            <p style={{color: "#94a9c4", fontSize: "0.867rem", textAlign: "center", padding: "2rem"}}>No fields added. Add questions on the left panel</p>
        ):(
            form.fields.map((field, idx) => {
                const startsPage = idx > 0 && field.page > form.fields[idx - 1].page;
                return (
                    <React.Fragment key={field.id}>
                        {(idx === 0 || startsPage) && (
                            <div className={styles.pageDivider}>
                                <span className={styles.pageDividerLabel}>Page {field.page + 1}</span>
                            </div>
                        )}
                <div className={styles.formGroup}>
                    {FIELD_TYPES[field.type]?.answerable && (
                        <label className={styles.formLabel}>{field.label}</label>
                    )}
                    {field.config.description && (
                        <p style={{fontSize: "0.8rem", color: "#94a9c4", marginBottom: "0.4rem"}}>{field.config.description}</p>
                    )}

                    <FieldInput field={field} value={testResponses[field.id]} onChange={(v) => onTestValueChange(field.id, v)}/>
                </div>
                    </React.Fragment>
                );
            })
        )}
        {form.fields.length > 0 && (
            <button type="submit" className={styles.submitButton}>Submit response</button>
        )}
        </form>
    </div>
    )
}
