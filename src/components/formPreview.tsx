import React from "react";
import {Form} from "../types/form";
import styles from "../styles/FormPreview.module.css";
interface FormPreviewProps {
    form: Form;
    testResponses: Record<string, any>;
    onTestValueChange: (fieldId: string, value: any) => void;
    onTestCheckboxChange: (fieldId: string, checked: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function FormPreview({
    form, testResponses, onTestValueChange, onTestCheckboxChange, onSubmit
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
                    <label className={styles.formLabel}>{field.label}</label>
                    {field.config.description && (
                        <p style={{fontSize: "0.8rem", color: "#94a9c4", marginBottom: "0.4rem"}}>{field.config.description}</p>
                    )}

                    {field.type === "text" && (
                        <input type="text" placeholder={field.config.placeholder || "Your answer"} className={styles.textInput} value={testResponses[field.id] || ""} onChange={(e) => onTestValueChange(field.id, e.target.value)}/>
                    )}
                    {field.type === "email" && (
                        <input type="email" placeholder={field.config.placeholder||"you@example.com"} className={styles.textInput} value={testResponses[field.id]||""} onChange={(e) => onTestValueChange(field.id, e.target.value)}/>
                    )}
                    {field.type === "rating" && (
                        <div className={styles.ratingStars}>{[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" className={`${styles.starButton} ${(testResponses[field.id] || 0) >= star ? styles.starActive : ""}`} onClick={() => onTestValueChange(field.id, star)}>★</button>))}</div>
                    )}

                    {field.type === "choice" && (
                        <div className={styles.choiceGroup}>
                            {field.options?.map((option, optIdx) => (
                                <label key={optIdx} className={styles.choiceLabel}>
                                    <input type="radio" name={`choice-${field.id}`} value={option} checked={testResponses[field.id] === option} onChange={() => onTestValueChange(field.id, option)} className={styles.radioInput}/>
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {field.type === 'checkbox' && (
                        <div className={styles.checkboxGroup}>
                            <input type="checkbox" id={field.id} className={styles.checkbox} checked={testResponses[field.id] || false} onChange={(e) => onTestCheckboxChange(field.id, e.target.checked)}/>
                            <label htmlFor={field.id} style={{fontSize: "0.867rem", color: "#94a9c4"}}>Confirm</label>
                        </div>
                    )}
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
