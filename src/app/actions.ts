"use server";
import prisma from "../lib/db";
import {Form, FormField, FieldConfig} from "../types/form";
import {getCurrentUser} from "../lib/auth";
import {validateAnswers} from "../lib/validation";

type DbField = {
    id: string;
    label: string;
    type: string;
    options: string[];
    required: boolean;
    page: number;
    config: unknown;
    deletedAt: Date | null;
}

type DbSubmission = {
    id: string;
    answers: unknown;
    submittedAt: Date;
    durationMs: number | null;
}
function toFormField(fd: DbField): FormField {
    return {
        id: fd.id,
        label: fd.label,
        type: fd.type as FormField["type"],
        options: fd.options,
        required: fd.required,
        page: fd.page,
        config: (fd.config as FieldConfig)??{}, ...(fd.deletedAt? {deleted: true}:{})
    };
}

const liveFields = {
    where: {deletedAt: null},
    orderBy: [{page: "asc" as const}, {order: "asc" as const}]
};
export async function getForms(): Promise<Form[]> {
    try {
        const user = await getCurrentUser();
        if (!user) return [];
        const dbForms = await prisma.form.findMany({
            where: {userId: user.id},
            orderBy: {createdAt: "desc"},
            include: {fields: liveFields}
        });

        return dbForms.map((f) => ({
            id: f.id,
            title: f.title,
            responses: f.responses,
            isAccepting: f.isAccepting,
            fields: f.fields.map(toFormField)
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
                userId: user.id,
                fields: {
                    create: [
                        {
                            id: crypto.randomUUID(),
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
            fields: newForm.fields.map(toFormField)
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
        const result = await prisma.form.deleteMany({
            where: {id, userId: user.id}
        });
        return result.count > 0;
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
        const keptIds = fields.map((f) => f.id);
        await prisma.$transaction([
            prisma.formField.updateMany({
                where: {formId, deletedAt: null, id: {notIn: keptIds}},
                data: {deletedAt: new Date()}
            }),
            ...fields.map((field, idx) => {
                const row = {
                    type: field.type,
                    label: field.label,
                    order: idx,
                    page: field.page ?? 0,
                    options: field.options ?? [],
                    required: field.required ?? false,
                    config: (field.config ?? {}) as object
                };

                return prisma.formField.upsert({
                    where: {id: field.id},
                    create: {id: field.id, formId, ...row},
                    update: {...row, deletedAt: null}
                });
            })
        ]);
        return true;
    } catch (error) {
        console.error("Failed to save form fields:", error);
        return false;
    }
}

export type SubmitResult = |{ok: true}|{ok: false; errors?: Record<string, string>; message?:string};
export async function submitFormResponse(formId: string, answers: Record<string, any>, durationMs?: number): Promise<SubmitResult>  {
    try {
        const form = await prisma.form.findUnique({
            where: {id: formId},
            include: {fields: liveFields}
        });
        if (!form || !form.isAccepting) {
            return {ok: false, message: "This form isn't accepting responses. Let the form owner know about this"};
        }

        const fields = form.fields.map(toFormField);
        const errors = validateAnswers(fields, answers);
        if (Object.keys(errors).length > 0) return {ok: false, errors};

        const clean: Record<string, unknown> = {};
        for (const field of fields) {
            if (answers[field.id] !== undefined) clean[field.id] = answers[field.id];
        }
        await prisma.$transaction([
            prisma.submission.create({
                data: {formId, answers: clean as any, durationMs: durationMs ?? null}
            }),
            prisma.form.update({
                where: {id: formId},
                data: {
                    responses: {increment: 1}
                }
            })
        ]);
        return {ok: true};
    } catch (error) {
        console.error("Failed to submit form response:", error);
        return {ok: false, message: "That didn't work, try again please"};
    }
}

export async function getFormFieldHistory(formId: string):Promise<FormField[]> {
    try {
        const user = await getCurrentUser();
        if (!user) return [];
        const owned = await prisma.form.findFirst({where: {id: formId, userId: user.id}});
        if (!owned) return [];
        const fields = await prisma.formField.findMany({
            where: {formId},
            orderBy: [{page: "asc"}, {order: "asc"}]
        });
        return fields.map(toFormField);
    } catch (error) {
        console.error("Failed to fetch form field history:", error);
        return [];
    }
}
export async function getPublicForm(id: string): Promise<Form | null> {
    try {
        const f = await prisma.form.findUnique({
            where: {id},
            include: {fields: liveFields}
        });

        if (!f) return null;

        return {
            id: f.id,
            title: f.title,
            responses: f.responses,
            isAccepting: f.isAccepting,
            fields: f.fields.map(toFormField)
        };
    } catch (error) {
        console.error("Failed to fetch form:", error);
        return null;
    }
}

export async function getFormSubmissions(
    formId: string
): Promise<{id: string; answers: Record<string, any>; submittedAt: Date; durationMs: number | null}[]> {
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
            submittedAt: s.submittedAt,
            durationMs: s.durationMs ?? null
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
            where: {id, userId: user.id}, include: {fields: liveFields}
        });

        if (!f) return null;
        return {
            id: f.id, title: f.title, responses: f.responses, isAccepting: f.isAccepting, fields: f.fields.map(toFormField)
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