"use client";
import {useState, useEffect} from "react";
import styles from "./page.module.css";
import {Form, FormField} from "../types/form";
import Dashboard from "../components/Dashboard";
import CreateFormModal from "../components/CreateFormModal";
import FormBuilder from "../components/FormBuilder";
import FormPreview from "../components/FormPreview";
import {getForms, createForm, deleteForm, saveFormFields, submitFormResponse} from "./actions";


export default function Home() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testResponses, setTestResponses] = useState<Record<string, any>>({});

  const activeForm = forms.find((f) => f.id === selectedFormId);

  useEffect(() => {
    async function loadForms() {
      setIsLoading(true);
      const dbForms = await getForms();
      setForms(dbForms);
      setIsLoading(false);
    }
    loadForms();
  }, []);

  const handleCreateForm = (title: string) => {
    const newForm = await createForm(title);
    if (newForm) {
      setForms([newForm, ...forms]);
      setSelectedFormId(newForm.id);
      setTestResponses({});
    } else {
      alert("Failed to create form in the database.");
    }
    setShowCreateModal(false);
  };
 const handleDeleteForm = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const success = await deleteForm(id);
    if (success) {
      setForms(forms.filter((f) => f.id !== id));
      if (selectedFormId === id) setSelectedFormId(null);
    } else {
        alert("Failed to delete the form from the database");
    }
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

  const handleSaveFields = async () => {
    if (!activeForm) return;
    setIsSaving(true);
    const success = await saveFormFields(activeForm.id, activeForm.fields);
    setIsSaving(false);
    if (success) {
      alert("Form changes saved to database successfully!");
    } else {
      alert("Failed to save form changes");
    }
  }

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

  
  const testSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;
    setIsSaving(true);
    const success = await submitFormResponse(activeForm.id, testResponses);
    setIsSaving(false);

    if (success) {
      alert(`Response recorded in Postgres!\n\nData Submitted:\n${JSON.stringify(testResponses, null, 2)}`);
      setSelectedFormId(null);
      setTestResponses({});
      setForms(await getForms());
    } else {
      alert("Failed to submit form response");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => setSelectedFormId(null)} style={{cursor: "pointer"}}>Better Forms</div>
        {selectedFormId === null ? (<button className={styles.button} onClick={() => setShowCreateModal(true)}>New Form</button>)
        :
        (
          <div style={{display: "flex", gap: "0.67rem"}}>
            <button className="button button-secondary" 
          </div>
        )
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