"use client";
import React from "react";
import {FormField} from "../types/form";
import styles from "../styles/FormPreview.module.css";

interface FieldInputProps {
    field: FormField;
    value: any;
    onChange: (value: any) => void;
}
export default function FieldInput({field, value, onChange}: FieldInputProps) {
    switch (field.type) {
        case "heading":
            return<h3 className={styles.headingField}>{field.label}</h3>;
        
        case "paragraph":
            return <p className={styles.paragraphField}>{field.label}</p>;

        case "text":
            return <input type="text" className={styles.textInput} placeholder={field.config.placeholder||"Your answer..."} value={value||""} onChange={(e)=> onChange(e.target.value)}/>;

        case "email":
            return <input type="email" className={styles.textInput} placeholder={field.config.placeholder||"67@example.com"} value={value||""} onChange={(e)=> onChange(e.target.value)}/>;
        case "url":
            return <input type="url" className={styles.textInput} placeholder={field.config.placeholder||"https://hackclub.com"} value={value||""} onChange={(e)=> onChange(e.target.value)}/>;

        case "number":
            return <input type="number" className={styles.textInput} min={field.config.min} max={field.config.max} placeholder={field.config.placeholder} value={value?? ""} onChange={(e)=> onChange(e.target.value === ""?"": Number(e.target.value))}/>;

        case "date":
            return <input type="date" className={styles.textInput} value={value||""} onChange={(e)=> onChange(e.target.value)}/>;

        case "textarea":
            return <textarea className={styles.textArea} rows={4} placeholder={field.config.placeholder||"Your answer..."} value={value||""} onChange={(e)=> onChange(e.target.value)}/>;

        case "dropdown":
            return (
                <select className={styles.textInput} value={value||""} onChange={(e) => onChange(e.target.value)}>
                    <option value="">Choose an option</option>
                    {field.options?.map((option)=><option key={option} value={option}>{option}</option>)}
                </select>
            );
        
        case "choice":
            return (
                <div className={styles.choiceGroup}>
                    {field.options?.map((option,optIdx)=> (
                        <label key={optIdx} className={styles.choiceLabel}>
                            <input type="radio" name={`choice-${field.id}`} value={option} checked={value===option} onChange={()=> onChange(option)} className={styles.radioInput}/>
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );
        
        case "multiselect": {
            const selected: string[] = Array.isArray(value)? value:[];

            return (
                <div className={styles.choiceGroup}>
                    {field.options?.map((option, optIdx) => (
                        <label key={optIdx} className={styles.choiceLabel}>
                            <input type="checkbox" className={styles.checkbox} checked={selected.includes(option)} onChange={(e)=> onChange(e.target.checked? [...selected, option]: selected.filter((v)=> v !== option))}/>
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );
        }

        case "checkbox":
            return (
                <div className={styles.checkboxGroup}>
                    <input type="checkbox" id={field.id} className={styles.checkbox} checked={value||false} onChange={(e) => onChange(e.target.checked)}/>
                    <label htmlFor={field.id} style={{fontSize: "0.867rem",color: "#8ca2bf"}}>Confirm</label>
                </div>
            );
        
        case "rating":
            return (
                <div className={styles.ratingStars}>
                    {[1,2,3,4,5].map((star) => (
                        <button key={star} type="button" className={`${styles.starButton} ${(value||0)>= star? styles.starActive:""}`} onClick={()=> onChange(star)}>★</button>
                    ))}
                </div>
            );
    }
    return null;
}