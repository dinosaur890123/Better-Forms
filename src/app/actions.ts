"use server";
import prisma from "../lib/db";
import {Form, FormField} from "../types/form";

export async function getForms(): Promise<Form[]> {
    try {
        const dbForms = await prisma.form.findMany({
            orderBy: {createdAt: "desc"},
            include: {
                fields: {
                    orderBy: {order: "asc"}
                }
            }
        });

        return dbForms.map((f) => ({
            id: f.id,
            title: f.title,
            responses: f.responses,
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

        return (
            id: newForm.id,
            title: newForm.title,
            responses: newForm.responses,
            fields: newForm.fields.map((fd) => ({
                id: fd.id,
                label: fd.label,
                type: fd.type as FormField["type"],
                options: fd.options
            }))
        );
    } catch (error) {
        console.error("Failed to create the form:", error);
        return null;
    }
}

export async function deleteForm(id: string): Promise<boolean> {
    try {
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
        await prisma.$transaction([
            prisma.formformField.deleteMany({where: {formId}}),
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