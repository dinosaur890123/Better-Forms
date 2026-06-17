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

  const handleCreateForm = (e: React.FormEvent) => {
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
        f.id === activeForm.id ? {...f, fields: [...f.fields, newField]} : f
      )
    );
  };
  
  const deleteField = (fieldId: string) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) =>
        f.id === activeForm.id ? { ...f, fields: f.fields.filter((fd) => fd.id !== fieldId)} : f
      )
    );
  };


  const updateFieldLabel = (fieldId: string, label: string) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) =>
        f.id === activeForm.id
          ? {
              ...f, fields: f.fields.map((fd) => fd.id === fieldId ? {...fd, label} : fd)
            } : f
      )
    );
  };

  const testSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;
    setForms(
      forms.map((f) => f.id === activeForm.id ? {...f, responses: f.responses + 1} : f
      )
    );
    alert("Response submitted successfully.");
    setSelectedFormId(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => setSelectedFormId(null)} style={{cursor: "pointer"}}>Better Forms</div>
        {selectedFormId === null ? (<button className={styles.button} onClick={() => setShowCreateModal(true)}>New Form</button>)
        :
        (<button className={styles.secondaryButton} onClick={() => setSelectedFormId(null)}>Back to Forms</button>)
        }
      </header>

      <main className={styles.main}>
        {selectedFormId === null ? (
          <>
            <h1 className={styles.title}>Your Forms</h1>
            <div className={styles.grid}>
              {forms.map((form) => (
                <div key={form.id} className={styles.card} onClick={() => setSelectedFormId(form.id)}>
                  <div className={styles.cardHeader}>
                    <h3>{form.title}</h3>
                    <button 
                      className={styles.deleteLink} onClick={(e) => handleDeleteForm(e, form.id)}>Delete</button>
                  </div>
                  <p>{form.responses} responses</p>
                </div>
              ))}
              </div>
          </>
        ):(
          activeForm && (
            <div className={styles.workspace}>
              <div className={styles.editorPanel}>
                <div className={styles.panelHeader}>
                  <h2>Edit Form Questions</h2>
                  <p>You can customise the question labels below.</p>
                </div>
                <div className={styles.fieldsList}>
                  {activeForm.fields.map((field, idx) => (
                    <div key={field.id} className={styles.editorFieldCard}>
                      <div className={styles.fieldHeader}>
                        <span className={styles.fieldBadge}>Q{idx + 1} ({field.type})</span>
                        <button className={styles.deleteLink} onClick={() => deleteField(field.id)}>Remove</button>
                      </div>
                      <input type="text" className={styles.fieldInput} value={field.label} onChange={(e) => updateFieldLabel(field.id, e.target.value)} placeholder="Enter question label..."/>
                    </div>
                  ))}
                </div>

                <div className={styles.builderToolbar}>
                  <button className={styles.toolBtn} onClick={() => addField("text")}>Add Text Question</button>
                  <button className={styles.toolBtn} onClick={() => addField("checkbox")}>Add Checkbox</button>
                </div>
              </div>
              <div className={styles.testerPanel}>
                <div className={styles.panelHeader}>
                  <h2>Form Preview</h2>
                  <p>Submit responses to test the form functionality.</p>
                </div>
                <form onSubmit={testSubmit} className={styles.testFormCard}>
                  <h3 className={styles.testFormTitle}>{activeForm.title}</h3>
                  {activeForm.fields.length === 0 ? (
                    <p style={{color: "#64748b", fontSize: "0.867rem", textAlign: "center", padding: "2rem"}}>No fields added yet, you should add questions on the left panel!</p>
                  ): (
                    activeForm.fields.map((field) => {
                      <div key={field.id} className={styles.formGroup}>
                        <label className={styles.formLabel}>{field.label}</label>
                        {field.type === "text" ? (
                          <input type="text" placeholder="Your answer..." className={styles.textInput}/>
                        ):(
                          <div className={styles.checkboxGroup}>
                            <input type="checkbox" id={field.id} className={styles.checkbox}/>
                            <label htmlFor={field.id} style={{fontSize: "0.867rem", color: "#475569" }}>Confirm</label>
                          </div>
                        )}
                      </div>
                    })
                  )}
                  {activeForm.fields.length > 0 && (<button type="submit" className={styles.submitButton}>Submit Response</button>
                  )}          
                </form>
              </div>
            </div>
          )
        )}
      </main>

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Create new form</h3>
            <form onSubmit={handleCreateForm}>
              <input type="text" className={styles.modalInput} placeholder="e.g. Customer Feedback Survey" value={newFormTitle} onChange={(e) => setNewFormTitle(e.target.value)} autoFocus/>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className={styles.button}>Create Form</button>
              </div>
            </form>
        </div>

      )}
    </div>
}