"use client";
import React, {useState} from "react";
import {Form} from "../types/form";
import {submitFormResponse} from "../app/actions";
import styles from "../styles/FormPreview.module.css";
import page from "../styles/PublicPage.module.css";

export default function PublicForm({form}: {form: Form}) {
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState(false);

    const setValue = (fieldId: string, value: any) => {
        setResponses({...responses, [fieldId]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(false);
        const success = await submitFormResponse(form.id, responses);
        setSubmitting(false);
        if (success) {
            setDone(true);
        } else {
            setError(true);
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

    return (
        <form onSubmit={handleSubmit} className={page.card}>
            <h1 className={styles.testFormTitle}>{form.title}</h1>
            {form.fields.length === 0 ? (
                <p style={{color: "#536f97", fontSize: "0.867rem"}}>
                    This form doesn't have questions
                </p>
            ):(
                form.fields.map((field) => {
                    <div key={field.id} className={styles.formGroup}>
                        <label className={styles.formLabel}>{field.label}</label>

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

                        {field.}
                    </div>
                })
            )}
        </form>
    )
}

