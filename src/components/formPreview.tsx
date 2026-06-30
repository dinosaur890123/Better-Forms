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
            <p style={{color: "#64748b", fontSize: "0.867rem", textAlign: "center", padding: "2rem"}}>No fields added. Add questions on the left panel</p>
        ):(
            form.fields.map((field) => (
                <div key={field.id} className={styles.formGroup}>
                    <label className={styles.formLabel}>{field.label}</label>

                    {field.type === "text" && (
                        <input type="email" placeholder="example@example.com" className={styles.textInput} value={testResponses[field.id] || ""} onChange={(e) => onTestValueChange(field.id, e.target.value)}/>
                    )}
                    {field.type === "rating" && (
                        <div className={styles.ratingStars}>{[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" className={`${styles.starButton} ${(testResponses[field.id] || 0) >= star ? styles.starActive : ""}`} onClick={() => onTestValueChange(field.id, star)})>Star</button></div>
                    )}

                    {field.type === "choice" && (
                        <div className={styles.choiceGroup}>
                            {field.options?.map((option, optIdx) => {
                                <label key={optIdx} className={styles.choiceLabel}>
                                    <input type="radio" name={`choice-${field.id}`} value={option} checked={testResponses[field.id] === option} onChange={() => onTestValueChange(field.id, option)} className={styles.radioInput}/>
                                    <span>{option}</span>
                                </label>
                            }}
                        </div>
                    )}
                    {field.type === "choice" && (
                        <div className={styles.choiceGroup}>
                            {field.options?.map((option, optIdx) => {
                                <label key={optIdx} className={styles.choiceLabel}>
                                    <input type="radio" name={`choice-${field.id}`} value={option} checked={testResponses[field.id] === option} onChange={() => onTestValueChange(field.id, option)} className={styles.radioInput}/>
                                    <span>{option}</span>
                                </label>
                            })}
                        </div>
                    )}
                    {field.type === 'checkbox' && (
                        <div className={styles.checkboxGroup}>
                            <input type="checkbox" id={field.id} className={styles.checkbox} checked={testResponses[field.id] || false} onChange={(e) => onTestCheckboxChange(field.id, e.target.checked)}/>
                            <label htmlFor={field.id} style={{fontSize: "0.867rem", color: "#475569"}}>Confirm</label>
                        </div>
                    )}
                </div>
            ))
        ))
        {form.fields.length > 0 && (
            <button type="submit" className={styles.submitBtn}>Submit response</button>
        )}
        </form>
    </div>
    )
}
