"use client";
import {useState} from "react";
import styles from "./page.module.css";

interface FormField {
  id: string;
  label: string;
  type: "text" | "checkbox";
}

interface Form {
  id: string;
  title: string;
  responses: number;
  fields: FormField[];
}
export default function Home() {
  const [forms, setForms] = useState<Form[]>([
    {
      id: "feedback",
      title: "Product feedback survey",
      responses: 12,
      fields: [
        {id: "1", label: "What is your name?", type: "text"},
        {id: "2", label: "Would you recommend us to a friend?", type: "checkbox"},
      ]
    },
    {
      id: "rsvp",
      title: "Event RSVP", // sounds kinda cringe, i'll change it out later on
      responses: 4,
      fields: [
        {id: "1", label: "Email sddress", type: "text"},
        {id: "2", label: "Do you need a place to park your car", type: "checkbox"}, // skull, genuinely first thing i thought of
      ]
    }
  ]);

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");

  const activeForm = forms.find((f) => f.id === selectedFormId);

  const handleCreateForm = (e: React.formEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) return;

    const newForm: Form = {
      id: Date.now().toString(),
      title: newFormTitle.trim(),
      responses: 0,
      fields: [
        {id: "1", label: "First question", type: "text"}
      ]
    };
    setForms([...forms, newForm]);
    setSelectedFormId(newForm.id);
    setShowCreateModal(false);
    setNewFormTitle("");
  };
  const handleDeleteForm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setForms(forms.filter((f) => f.id !== id));
    if (selectedFormId === id) setSelectedFormId(null);
  };

  const addField = (type: "text" | "checkbox") => {
    if (!activeForm) return;
    const newField: FormField = {
      id: Date.now().toString(), label: type === "text" ? "New text question" : "New checkbox option", type
    };

    setForms(
      forms.map((f) =>
        f.id === activeForm.id ? { ...f, fields: [...f.fields, newField] } : f
      )
    );
  };
  }
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Better Forms</div>
        <button className={styles.button}>New Form</button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Your Forms</h1>

        <div className={styles.grid}>
          {mockForms.map((form) => (
            <div key={form.id} className={styles.card}>
              <h3>{form.title}</h3>
              <p>{form.responses} responses</p>
            </div>
          ))}
        </div>
      </main>
    </div>
}