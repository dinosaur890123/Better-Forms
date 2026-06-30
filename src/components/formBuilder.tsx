import React from "react";
import {Form} from "../types/form";
import styles from "../styles/FormBuilder.module.css";

interface FormBuilderProps {
    form: Form;
    onAddField: (type: "text" | "checkbox" | "choice" | "rating" | "email") => void;
    onDeleteField: (fieldId: string) => void;
    onUpdateFieldLabel: (fieldId: string, label: string) => void;
    onAddChoiceOption: (fieldId: string) => void;
    onUpdateChoiceOption: (fieldId: string, optionIdx: number, value: string) => void;
    onDeleteChoiceOption: (fieldId: string, optionIdx: number) => void;
}

export default function FormBuilder({
    form, onAddField, onDeleteField, onUpdateFieldLabel, onAddChoiceOption, onUpdateChoiceOption, onDeleteChoiceOption
}: FormBuilderProps) {
    return (
        <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
                <h2>Edit form questions</h2>
                <p>Configure question labels and multiple choice options</p>
            </div>
            <div className={styles.fieldsList}>
                {form.fields.map((field, idx) => (
                    <div key={field.id} className={styles.editorFieldCard}>
                        <div className={styles.fieldHeader}>
                            <span className={styles.fieldBadge}>Q{idx + 1} ({field.type})</span>
                            <button className={styles.deleteLink} onClick={() => onDeleteField(field.id)}>Remove</button>                            
                        </div>
                        
                        <input type="text" className={styles.fieldInput} value={field.label} onChange={(e) => onUpdateFieldLabel(field.id, e.target.value)} placeholder="Enter question label here"/>

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
                ))}
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