import React from "react";
import {Form, FieldConfig} from "../types/form";
import styles from "../styles/FormBuilder.module.css";

interface FormBuilderProps {
    form: Form;
    onAddField: (type: "text" | "checkbox" | "choice" | "rating" | "email") => void;
    onDeleteField: (fieldId: string) => void;
    onUpdateFieldLabel: (fieldId: string, label: string) => void;
    onToggleRequired: (fieldId: string, required: boolean) => void;
    onAddChoiceOption: (fieldId: string) => void;
    onUpdateChoiceOption: (fieldId: string, optionIdx: number, value: string) => void;
    onDeleteChoiceOption: (fieldId: string, optionIdx: number) => void;
    onUpdateFieldConfig: (fieldId: string, patch: Partial<FieldConfig>) => void;
    onTogglePageBreak: (fieldId: string) => void;
}

export default function FormBuilder({
    form, onAddField, onDeleteField, onUpdateFieldLabel, onToggleRequired, onAddChoiceOption, onUpdateChoiceOption, onDeleteChoiceOption, onUpdateFieldConfig, onTogglePageBreak
}: FormBuilderProps) {
    return (
        <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
                <h2>Edit form questions</h2>
                <p>Configure question labels and multiple choice options</p>
            </div>
            <div className={styles.fieldsList}>
                {form.fields.map((field, idx) => {
                    const startsPage = idx > 0 && field.page > form.fields[idx - 1].page;
                    return (
                    <React.Fragment key={field.id}>
                        {(idx === 0 || startsPage) && (
                            <div className={styles.pageDivider}>
                                <span className={styles.pageDividerLabel}>Page {field.page + 1}</span>
                            </div>
                        )}
                    <div className={styles.editorFieldCard}>
                        <div className={styles.fieldHeader}>
                            <span className={styles.fieldBadge}>Q{idx + 1} ({field.type})</span>
                            <div style={{display: "flex", gap: "0.67rem", alignItems: "center"}}>
                                {idx > 0 && (
                                    <button type="button" className={styles.breakButton} onClick={() => onTogglePageBreak(field.id)}>
                                        {startsPage ? "Remove page break" : "Page break above"}
                                    </button>
                                )}
                                <button className={styles.deleteLink} onClick={() => onDeleteField(field.id)}>Remove</button>
                            </div>
                        </div>

                        <input type="text" className={styles.fieldInput} value={field.label} onChange={(e) => onUpdateFieldLabel(field.id, e.target.value)} placeholder="Enter question label here"/>

                        <label style={{display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", marginTop: "0.4rem", color: "var(--text-muted)"}}>
                            <input type="checkbox" checked={field.required} onChange={(e) => onToggleRequired(field.id, e.target.checked)}/>
                            Required
                        </label>

                        <div className={styles.configGrid}>
                            <label className={styles.configLabel}>
                                Help text
                                <input type="text" className={styles.configInput} value={field.config.description ?? ""} onChange={(e)=>onUpdateFieldConfig(field.id,{description: e.target.value})} placeholder="Shown under the question"/>
                            </label>

                            {(field.type === "text" || field.type === "email") && (
                                <label className={styles.configLabel}>
                                    Placeholder
                                    <input type="text" className={styles.configInput} value={field.config.placeholder ?? ""} onChange={(e)=>onUpdateFieldConfig(field.id,{placeholder: e.target.value})} placeholder={field.type === "email"?"67@example.com" : "Your response..."}/>
                                </label>
                            )}

                            {field.type === "text" && (
                                <div className={styles.configRow}>
                                    <label className={styles.configLabel}>
                                        Min length
                                        <input type="number" min={0} className={styles.configInput} value={field.config.minLength ?? ""} onChange={(e)=>onUpdateFieldConfig(field.id,{minLength: e.target.value===""?undefined:Number(e.target.value)})}/>
                                    </label>

                                    <label className={styles.configLabel}>
                                        Max length
                                        <input type="number" min={0} className={styles.configInput} value={field.config.maxLength ?? ""} onChange={(e)=>onUpdateFieldConfig(field.id,{maxLength: e.target.value===""?undefined:Number(e.target.value)})}/>
                                    </label>
                                </div>
                            )}
                        </div>

                        {field.type === "choice" && (
                            <div className={styles.optionsManager}>
                                <label className={styles.optionsLabel}>Options:</label>
                                <div className={styles.optionsList}>
                                    {field.options?.map((option, optIdx) => (
                                        <div key={optIdx} className={styles.optionRow}>
                                        <input type="text" className={styles.optionInput} value={option} onChange={(e) => onUpdateChoiceOption(field.id, optIdx, e.target.value)} placeholder={`Option ${optIdx + 1}`}/>
                                        <button type="button" className={styles.deleteOptionButton} onClick={() => onDeleteChoiceOption(field.id, optIdx)}>×</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className={styles.addOptionButton} onClick={() => onAddChoiceOption(field.id)}>Add Option</button>
                            </div>
                        )}
                    </div>
                    </React.Fragment>
                    );
                })}
            </div>
        <div className={styles.builderToolbar}>
        <div className={styles.toolbarGrid}>
          <button className={styles.toolButton} onClick={() => onAddField("text")}>
            Text
          </button>
          <button className={styles.toolButton} onClick={() => onAddField("email")}>
            Email
          </button>
          <button className={styles.toolButton} onClick={() => onAddField("choice")}>
            Choice
          </button>
          <button className={styles.toolButton} onClick={() => onAddField("rating")}>
            Rating
          </button>
          <button className={styles.toolButton} onClick={() => onAddField("checkbox")}>
            Checkbox
          </button>
        </div>
      </div>
    </div>
    );
}