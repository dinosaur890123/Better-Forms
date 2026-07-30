"use client";
import {useRouter} from "next/navigation";
import {signOut} from "../auth/actions";
import {useState, useEffect, useRef} from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {Form, FormField} from "../../types/form";
import Dashboard from "../../components/dashboard";
import CreateFormModal from "../../components/createFormModal";
import FormBuilder from "../../components/formBuilder";
import FormPreview from "../../components/formPreview";
import {getForms, createForm, deleteForm, saveFormFields, submitFormResponse, getSessionUser, updateFormSettings} from "../actions";
import ConfirmModal from "../../components/ConfirmModal";


export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testResponses, setTestResponses] = useState<Record<string, any>>({});
  const [formToDelete, setFormToDelete] = useState<{id: string; title: string} | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedRef = useRef<string>("");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  const activeForm = forms.find((f) => f.id === selectedFormId);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const sessionUser = await getSessionUser();
      if (!sessionUser) {
        router.replace("/");
        return;
      }
      setUserEmail(sessionUser.email);
      const dbForms = await getForms();
      setForms(dbForms);
      setIsLoading(false);
    }
    load();
  }, [router]);

  useEffect(() => {
    if (activeForm) lastSavedRef.current = JSON.stringify(activeForm.fields);
    setSaveStatus("idle");
  }, [selectedFormId]);

  useEffect(() => {
    if (!activeForm) return;
    const signature = JSON.stringify(activeForm.fields);
    if (signature === lastSavedRef.current) return;
    
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      const ok = await saveFormFields(activeForm.id, activeForm.fields);
      if (ok) lastSavedRef.current = signature;
      setSaveStatus(ok ? "saved" : "idle");
    },1000);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [activeForm, selectedFormId]);

  const handleCreateForm = async (title: string) => {
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
  const requestDeleteForm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const form = forms.find((f) => f.id === id);

    if (form) setFormToDelete({id: form.id, title: form.title});
  };

  const confirmDeleteForm = async () => {
    if (!formToDelete) return;
    const success = await deleteForm(formToDelete.id);
    if (success) {
      setForms(forms.filter((f) => f.id !== formToDelete.id));
      if (selectedFormId === formToDelete.id) setSelectedFormId(null);
    }
    setFormToDelete(null);
  };
  

  const addField = (type: "text" | "checkbox" | "choice" | "rating" | "email") => {
    if (!activeForm) return;
    const newField: FormField = {
      id: crypto.randomUUID(), label: type === "text" ? "New text question" : type === "email" ? "New email question" : type === "rating" ? "Rate your experience"
          : type === "choice"
          ? "Select an option"
          : "New Checkbox option", type, required: false, page: 0, config: {}, ...(type === "choice" ? {options: ["Option 1", "Option 2"]} : {})
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

  const toggleRequired = (fieldId: string, required: boolean) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) =>
        f.id === activeForm.id
          ? {
              ...f, fields: f.fields.map((fd) => fd.id === fieldId ? {...fd, required} : fd)
            } : f
      )
    );
  };

  const addChoiceOption = (fieldId: string) => {
    if (!activeForm) return;
    setForms(
      forms.map((f) => f.id === activeForm.id ? {...f, fields: f.fields.map((fd) => fd.id === fieldId ? {...fd, options: [...(fd.options || []), `Option ${(fd.options?.length || 0) + 1}`]} : fd)} : f)
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
  const handleShareLink = (id: string) => {
    const url = `${window.location.origin}/forms/${id}`;
    navigator.clipboard.writeText(url).then(
      () => alert(`Public link copied:\n${url}`),
      () => alert(`Share this link:\n${url}`)
    )
  };

  const requestShareForm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleShareLink(id);
};

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };
  const handleTestValueChange = (fieldId: string, value: any) => {
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

  const handleToggleAccepting = async () => {
    if (!activeForm) return;
    const next = !activeForm.isAccepting;
    setForms(forms.map((f) => f.id === activeForm.id ? {...f, isAccepting: next} : f));
    await updateFormSettings(activeForm.id, next);
  }

  
  const testSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;
    setIsSaving(true);
    const result = await submitFormResponse(activeForm.id, testResponses);
    setIsSaving(false);

    if (result.ok) {
      alert(`Response recorded in Postgres!\n\nData Submitted:\n${JSON.stringify(testResponses, null, 2)}`);
      setSelectedFormId(null);
      setTestResponses({});
      setForms(await getForms());
    } else {
      const problems = result.errors ? Object.values(result.errors).join("\n") : result.message;
      alert(`Failed to submit form response\n\n${problems ?? ""}`);
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
            {selectedFormId && (
              <Link href={`/forms/${selectedFormId}/responses`} className="button button-secondary">
                Responses
              </Link>
            )}
            {selectedFormId && (
                <Link href={`/forms/${selectedFormId}/analytics`} className="button button-secondary">Analytics
                </Link>
              )}
            {selectedFormId && (
              <button className="button button-secondary" onClick={() => handleShareLink(selectedFormId)} disabled={isSaving}>
                Share
              </button>
            )}
            <span style={{fontSize: "0.867rem", color: "var(--text-muted)", minWidth: "3.67rem"}}>
                {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : ""}
              </span>
            <button className="button button-secondary" onClick={handleToggleAccepting} disabled={isSaving}>{activeForm?.isAccepting ? "Accepting: On":"Accepting: Off"}</button>
            <button className="button button-secondary" onClick={() => {setSelectedFormId(null); setTestResponses({});}} disabled={isSaving}>Back to Forms</button>
            {userEmail && (
            <>
              <span style={{fontSize: "0.767rem", color: "#4b6a94"}}>{userEmail}</span>
              <button className="button button-secondary" onClick={handleLogout}>Logout</button>
            </>
          )}
          </div>
          
        )
        }
      </header>

      <main className={styles.main}>
        
        {selectedFormId === null ? (
          <Dashboard forms={forms} onSelectForm={setSelectedFormId} onDeleteForm={requestDeleteForm} onShareForm={requestShareForm}/>
        ):(
          activeForm && (
            <div className={styles.workspace}>
              <FormBuilder 
                form={activeForm}
                onAddField={addField}
                onDeleteField={deleteField}
                onUpdateFieldLabel={updateFieldLabel}
                onToggleRequired={toggleRequired}
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

      <ConfirmModal 
        isOpen={formToDelete !== null}
        title="Delete form?"
        message={`This will forever delete your "${formToDelete?.title}", and is permanent. `}
        onConfirm={confirmDeleteForm}
        onCancel={() => setFormToDelete(null)}
        loading={deleting}
        />
    </div>
  );
}