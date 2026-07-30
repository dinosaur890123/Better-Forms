export type FieldType = "text" | "email" | "choice" | "rating" | "checkbox";
export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  page: number;
  config: FieldConfig;
  deleted?: boolean;
}
export interface Form {
  id: string;
  title: string;
  responses: number;
  isAccepting: boolean;
  fields: FormField[];
}
export interface FieldConfig {
  description?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}