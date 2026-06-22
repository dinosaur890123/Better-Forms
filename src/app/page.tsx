"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { Form, FormField } from "../types/form";
import Dashboard from "../components/Dashboard";
import CreateFormModal from "../components/CreateFormModal";
import FormBuilder from "../components/FormBuilder";
import FormPreview from "../components/FormPreview";


export default function Home() {
  const [forms, setForms] = useState<Form[]>([
    {
      id: "feedback",
      title: "Product feedback survey",
      responses: 12,
      fields: [
        {id: "1", label: "What is your name?", type: "text"},
        {id: "2", label: "Would you recommend us to a friend?", type: "checkbox"},
        {id: "3", label: "How did you hear about us?", type: "choice", options: ["Google Search", "Social media", "Friend recommendation", "Other"]},
        {id: "4", label: "Rate your overall experience", type: "rating" },
        {id: "5", label: "Would you to our newsletter?", type: "checkbox"} // cringe
      ]
    },
    {
      id: "rsvp",
      title: "Event RSVP", // sounds also kinda cringe, i'll change it out later on
      responses: 4,
      fields: [
        {id: "1", label: "Email sddress", type: "text"},
        {id: "2", label: "Do you need a place to park your car", type: "checkbox"}, // skull, genuinely first thing i thought of
      ]
    }
  ]);

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testResponses, setTestResponses] = useState<Record<string, any>>({});

  const activeForm = forms.find((f) => f.id === selectedFormId);

  const handleCreateForm = (title: string) => {
    const newForm: Form = {
      id: Date.now().toString(),
      title,
      responses: 0,
      fields: [
        {id: "1", label: "Full name", type: "text"}
      ]
    };
    setForms([...forms, newForm]);
    setSelectedFormId(newForm.id);
    setShowCreateModal(false);
    setTestResponses({});
  };
  const handleDeleteForm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setForms(forms.filter((f) => f.id !== id));
    if (selectedFormId === id) setSelectedFormId(null);
  };

  const addField = (type: "text" | "checkbox" | "choice" | "rating" | "email") => {
    if (!activeForm) return;
    const newField: FormField = {
      id: Date.now().toString(), label: type === "text" ? "New text question" : type === "email" ? "New email question" : type === "rating" ? "Rate your experience"
          : type === "choice"
          ? "Select an option"
          : "New Checkbox option", type, ...(type === "choice" ? { options: ["Option 1", "Option 2"] } : {})
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
        f.id === activeForm.id ? {...f, fields: f.fields.filter((fd) => fd.id !== fieldId)}
          : f
      )
    );

    const updatedResponses = { ...testResponses };
    delete updatedResponses[fieldId];
    setTestResponses(updatedResponses);
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

  const addChoiceOption = (fieldId: string) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) => f.id === activeForm.id ? {...f, fields: f.fields.map((fd) => fd.id === fieldId ? {...fd, ptions: fd.options?.map((opt, idx) => (idx === optionIdx ? value : opt))}:fd)}:f)
      // crazy trial and error in the line above
    );
  };

  const updateChoiceOption = (fieldId: string, optionIdx: number, value: string) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) => f.id === activeForm.id ? {...f, fields: f.fields.map((fd) => fd.id === fieldId ? {...fd, options: fd.options?.map((opt, idx) => (idx === optionIdx ? value : opt))} : fd)} : f
      )
    );
  };

  const deleteChoiceOption = (fieldId: string, optionIdx: number) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) => f.id === activeForm.id ? {...f, fields: f.fields.map((fd) => fd.id === fieldId ? {...fd, options: fd.options?.filter((_, idx) => idx !== optionIdx)} : fd)} : f
      )
    );
  };

  const handleTestValueCHange = (fieldId: string, value: any) => {
    setTestResponses({
      ...testResponses,
      [fieldId]: value
    });
  };

  const handleTestCheckboxChange = (fieldId: string, checked: boolean) => {
    setTestResponses({
      ...testResponses,
      [fieldId]: checked
    });
  }

  
  const testSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;
    setForms(
      forms.map((f) => f.id === activeForm.id ? {...f, responses: f.responses + 1} : f
      )
    );
    alert(`Response submitted successfully!\n\nData captured:\n${JSON.stringify(testResponses, null, 2)}`);
    setSelectedFormId(null);
    setTestResponses({});
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
          <Dashboard forms={forms} onSelectForm={setSelectedFormId} onDeleteForm={handleDeleteForm}/>
        ):(
          activeForm && (
            <div className={styles.workspace}>
              <FormBuilder 
                form={activeForm}
                onAddField={addField}
                onDeleteField={deleteField}
                onUpdateFieldLabel={updateFieldLabel}
                onAddChoiceOption={addChoiceOption}
                onUpdateChoiceOption={updateChoiceOption}
                onDeleteChoiceOption={deleteChoiceOption}
              />
              <FormPreview 
                form={activeForm}
                testResponses={testResponses}
                onTestValueChange={handleTestValueChange}
                onTestCheckboxChange={handleTestCheckboxChange}
                onSubmit={testSubmit}
              />              
            </div>
          )
        )}
      </main>
      <CreateFormModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateForm}
      />
  );
}