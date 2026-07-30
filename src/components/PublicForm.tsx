"use client";
import React, {useState, useRef} from "react";
import {Form} from "../types/form";
import {submitFormResponse} from "../app/actions";
import {validateAnswers} from "../lib/validation";
import styles from "../styles/FormPreview.module.css";
import page from "../styles/PublicPage.module.css";

export default function PublicForm({form}: {form: Form}) {
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const startTimeRef = useRef<number>(Date.now());

    const setValue = (fieldId: string, value: any) => {
        setResponses({...responses, [fieldId]: value});
        // Clear a field's error as soon as the respondent edits it
        if (fieldErrors[fieldId]) {
            const next = {...fieldErrors};
            delete next[fieldId];
            setFieldErrors(next);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const localErrors = validateAnswers(form.fields, responses);
        if (Object.keys(localErrors).length > 0) {
            setFieldErrors(localErrors);
            return;
        }

        setSubmitting(true);
        setFieldErrors({});
        const durationMs = Date.now() - startTimeRef.current;
        const result = await submitFormResponse(form.id, responses, durationMs);
        setSubmitting(false);

        if (result.ok) {
            setDone(true);
        } else if (result.errors) {
            setFieldErrors(result.errors);
        } else {
            setError(result.message ?? "Something went wrong, try again.");
        }
    };

    if (done) {
        return (
            <div className={page.card} style={{textAlign: "center"}}>
                <h1 className={styles.testFormTitle} style={{marginBottom: "0.67rem"}}>Thank you!</h1>
                <p style={{color: "#4a5d78", fontSize: "0.867rem"}}>
                    Your response has been recorded.
                </p>
            </div>
        );
    }

    if (!form.isAccepting) {
        return (
            <div className={page.card}>
                <h1 className={styles.testFormTitle}>{form.title}</h1>
                <p style={{marginTop: "0.67rem", color: "#596e8a"}}>This form isn't accepting responses. Contact the form owner if you need help with this.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className={page.card}>
            <h1 className={styles.testFormTitle}>{form.title}</h1>
            {form.fields.length === 0 ? (
                <p style={{color: "#536f97", fontSize: "0.867rem"}}>
                    This form doesn't have questions
                </p>
            ):(
                form.fields.map((field) => (
                    <div key={field.id} className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            {field.label}
                            {field.required && <span style={{color: "#d93f3f", marginLeft: "0.2rem"}}>*</span>}
                        </label>
                        {field.config.description && (
                            <p style={{fontSize: "0.8rem", color: "#5d718c", marginBottom: "0.4rem"}}>{field.config.description}</p>
                        )}

                        {field.type === "text" && (
                            <input type="text" placeholder="Your answer..." className={styles.textInput} value={responses[field.id] || ""} onChange={(e) => setValue(field.id, e.target.value)}/>
                        )}

                        {field.type === "email" && (
                            <input type="email" placeholder="test@dinosaur890123.com" className={styles.textInput} value={responses[field.id] || ""} onChange={(e) => setValue(field.id, e.target.value)}/>
                        )}

                        {field.type === "rating" && (
                            <div className={styles.ratingStars}>
                                {[1,2,3,4,5].map((star) => (
                                    <button key={star} type="button" className={`${styles.starButton} ${(responses[field.id] || 0) >= star ? styles.starActive : ""}`} onClick={() => setValue(field.id, star)}>★</button>
                                ))}
                            </div>
                        )}

                        {field.type === "choice" && (
                            <div className={styles.choiceGroup}>
                                {field.options?.map((option, optIdx) => (
                                    <label key={optIdx} className={styles.choiceLabel}>
                                        <input type="radio" name={`choice-${field.id}`} value={option} checked={responses[field.id] === option} onChange={() => setValue(field.id, option)} className={styles.radioInput}/>
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {field.type === "checkbox" && (
                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id={field.id} className={styles.checkbox} checked={responses[field.id] || false} onChange={(e) => setValue(field.id, e.target.checked)}/>
                                <label htmlFor={field.id} style={{fontSize: "0.867rem", color: "#5d718c"}}>Confirm</label>
                            </div>
                        )}

                        {fieldErrors[field.id] && (
                            <p style={{color: "#d93f3f", fontSize: "0.8rem", marginTop: "0.3rem"}}>{fieldErrors[field.id]}</p>
                        )}
                    </div>
                ))
            )}

            {error && (
                <p style={{color: "#d93f3f", fontSize: "0.8267rem", marginBottom: "1rem" }}>
                    {error}
                </p>
            )}

            {form.fields.length > 0 && (
                <button type="submit" className="button button-success" style={{width: "100%", marginTop: "0.rem"}} disabled={submitting}>{submitting ? "Submitting..." : "Submit response"}</button>
            )}
        </form>
    )
}

