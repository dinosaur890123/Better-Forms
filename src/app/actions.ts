"use server";
import prisma from "../lib/db";
import {Form, FormField} from "../types/form";
import {getCurrentUser} from "../lib/auth";

type DbFormWithFields = {
    id: string;
    title: string;
    responses: number;
    fields: {id: string; label: string; type: string; options: string[]}[];
    isAccepting: boolean;
}

type DbField = {
    id: string;
    label: string;
    type: string;
    options: string[];
}

type DbSubmission = {
    id: string;
    answers: unknown;
    submittedAt: Date;
}
export async function getForms(): Promise<Form[]> {
    try {
        const user = await getCurrentUser();
        if (!user) return [];
        const dbForms = await prisma.form.findMany({
            orderBy: {createdAt: "desc"},
            include: {
                fields: {
                    orderBy: {order: "asc"}
                }
            }
        });

        return dbForms.map((f: DbFormWithFields) => ({
            id: f.id,
            title: f.title,
            responses: f.responses,
            isAccepting: f.isAccepting,
            fields: f.fields.map((fd) => ({
                id: fd.id, label: fd.label, type: fd.type as FormField["type"], options: fd.options
            }))
        }));
    } catch (error) {
        console.error("Failed to fetch the forms:", error);
        return [];
    }
}

export async function createForm(title: string): Promise<Form | null> {
    try {
        const user = await getCurrentUser();
        if (!user) return null;
        const newForm = await prisma.form.create({
            data: {
                title,
                fields: {
                    create: [
                        {
                            id: Date.now().toString(),
                            type: "text",
                            label: "Full name",
                            order: 0
                        }
                    ]
                }
            },
            include: {
                fields: true
            }
        });

        return {
            id: newForm.id,
            title: newForm.title,
            responses: newForm.responses,
            isAccepting: newForm.isAccepting,
            fields: newForm.fields.map((fd: DbField) => ({
                id: fd.id,
                label: fd.label,
                type: fd.type as FormField["type"],
                options: fd.options
            }))
        };
    } catch (error) {
        console.error("Failed to create the form:", error);
        return null;
    }
}

export async function deleteForm(id: string): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        await prisma.form.delete({
            where: {id}
        });
        return true;
    } catch (error) {
        console.error("Failed to delete form:", error);
        return false;
    }
}

export async function saveFormFields(formId: string, fields: FormField[]): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        const owned = await prisma.form.findFirst({where: {id: formId, userId: user.id}});
        if (!owned) return false;
        await prisma.$transaction([
            prisma.formField.deleteMany({where: {formId}}),
            prisma.formField.createMany({
                data: fields.map((field, idx) => ({
                    id: field.id,
                    formId,
                    type: field.type,
                    label: field.label,
                    order: idx,
                    options: field.options || []
                }))
            })
        ]);
        return true;
    } catch (error) {
        console.error("Failed to save form fields:", error);
        return false;
    }
}
export async function submitFormResponse(formId: string, answers: Record<string, any>): Promise<boolean> {
    try {
        const form = await prisma.form.findUnique({where: {id: formId}});
        if (!form || !form.isAccepting) return false;
        await prisma.$transaction([
            prisma.submission.create({
                data: {
                    formId, answers: answers as any
                }
            }),
            prisma.form.update({
                where: {id: formId},
                data: {
                    responses: {increment: 1}
                }
            })
        ]);
        return true;
    } catch (error) {
        console.error("Failed to submit form response:", error);
        return false;
    }
}
export async function getPublicForm(id: string): Promise<Form | null> {
    try {
        const f = await prisma.form.findUnique({
            where: {id},
            include: {
                fields: {
                    orderBy: {order: "asc"}
                }
            }
        });

        if (!f) return null;

        return {
            id: f.id, 
            title: f.title, 
            responses: f.responses,
            isAccepting: f.isAccepting,
            fields: f.fields.map((fd: DbField) => ({
                id: fd.id,
                label: fd.label,
                type: fd.type as FormField["type"],
                options: fd.options
            }))
        };
    } catch (error) {
        console.error("Failed to fetch form:", error);
        return null;
    }
}

export async function getFormSubmissions(
    formId:string
): Promise<{id: string; answers: Record<string, any>; submittedAt: Date}[]> {
    try {
        const user = await getCurrentUser();
        if (!user) return [];
        const owned = await prisma.form.findFirst({where: {id: formId, userId: user.id}});
        if (!owned) return [];
        const submissions = await prisma.submission.findMany({
            where: {formId}, orderBy: {submittedAt: "desc"}
        });

        return submissions.map((s:DbSubmission) => ({
            id: s.id,
            answers: (s.answers as Record<string, any>) ?? {},
            submittedAt: s.submittedAt
        }))
    } catch (error) {
        console.error("Failed to fetch form submissions:", error);
        return [];
    }
}
export async function getOwnedForm(id: string): Promise<Form | null> {
    try {
        const user = await getCurrentUser();
        if (!user) return null;
        const f = await prisma.form.findFirst({
            where: {id, userId: user.id}, include: {fields: {orderBy: {order: "asc"}}}
        });

        if (!f) return null;
        return {
            id: f.id, title: f.title, responses: f.responses, isAccepting: f.isAccepting, fields: f.fields.map((fd: DbField) => ({
                id: fd.id, label: fd.label, type: fd.type as FormField["type"], options: fd.options
            }))
        }
    } catch (error) {
        console.error("Failed to fetch owned form:", error);
        return null;
    }
}
export async function getSessionUser(): Promise<{id: string; email: string} | null> {
    const user = await getCurrentUser();
    if (!user) return null;
    return {id: user.id, email: user.email};
}

export async function updateFormSettings(formId: string, isAccepting: boolean): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        const result = await prisma.form.updateMany({
            where: {id: formId, userId: user.id}, data: {isAccepting}
        });
        return result.count > 0;
    } catch (error) {
        console.error("Failed to update form settings:", error);
        return false;
    }
}