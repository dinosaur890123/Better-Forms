import React from "react";
import {Form} from "../types/form";
import styles from "../styles/FormBuilder.module.css";

interface FormBuilderProps {
    form: Form;
    onAddField: (type: "text" | "checkbox" | "choice" | "rating" | "email") => void;
    onDeleteField: (fieldId: string) => void;
    onUpdateFieldLabel: (fieldId: string, label: string) => void;
}