import React, {useState} from "react";
import styles from "../styles/CreateFormModal.module.css";

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
        <div clasName={styles.modal} onClick={(e) => e.stopPropagation()}></div>
    </div>
  )
}