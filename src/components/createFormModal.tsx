import React, {useState} from "react";
import styles from "../styles/createFormModal.module.css";

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}
export default function CreateFormModal({isOpen, onClose, onCreate}:CreateFormModalProps) {
  const [title, setTitle] = useState("");
  if (!isOpen) return null;
  const handleSubmit= (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle("");
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Create New Form</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" className={styles.modalInput} placeholder="e.g. Customer Feedback Survey" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus/>
                <div className={styles.modalActions}>
                    <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="button button-primary">Create Form</button>
                </div>
            </form>
        </div>
    </div>
  );
}