import React from "react";
import {Form} from "../types/form";
import styles from "../styles/Dashboard.module.css";
interface DashboardProps {
  forms: Form[];
  onSelectForm: (id: string) => void;
  onDeleteForm: (e: React.MouseEvent, id: string) => void;
}
export default function Dashboard({ forms, onSelectForm, onDeleteForm }: DashboardProps) {
  return (
    <>
      <h1 className={styles.title}>Your Forms</h1>
      <div className={styles.grid}>
        {forms.map((form) => (
          <div key={form.id} className={styles.card} onClick={() => onSelectForm(form.id)}>
            <div className={styles.cardHeader}>
              <h3>{form.title}</h3>
              <button className="button button-danger" onClick={(e) => onDeleteForm(e, form.id)}> Delete</button>
            </div>
            <p>{form.responses} responses</p>
          </div>
        ))}
      </div>
    </>
  );
}
