export interface FormField {
  id: string;
  label: string;
  type: "text" | "checkbox" | "choice" | "rating" | "email";
  options?: string[];
}
export interface Form {
  id: string;
  title: string;
  responses: number;
  fields: FormField[];
}
