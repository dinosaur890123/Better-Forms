"use client";
import React from "react";
import styles from "../styles/ConfirmModal.module.css"; // note to self: remember to make css for this

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmModal({
    isOpen, title, message, confirmLabel = "Delete", onConfirm, onCancel, loading,
}:ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.message}>{message}</p>
            <div className={styles.actions}>
                <button className={styles.cancel} onClick={onCancel} disabled={loading}>Cancel</button>
                <button className={styles.confirm} onClick={onConfirm} disabled={loading}>
                    {loading ? "Deleting..." : confirmLabel}
                </button>
            </div>
        </div>
        </div>
    );
}