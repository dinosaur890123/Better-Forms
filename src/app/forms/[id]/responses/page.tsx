import Link from "next/link";
import {notFound} from "next/navigation";
import {getOwnedForm, getFormSubmissions} from "../../../actions";
import styles from "../../../../styles/PublicPage.module.css";
export const dynamic = "force-dynamic";

function formatAnswer(value: any): string {
    if (value === undefined || value === null || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
}

export default async function ResponsesPage({
    params,
}:{
    params: Promise<{id: string}>;
}) {
    const {id} = await params;
    const form = await getOwnedForm(id);
    if (!form) notFound();
    const submissions = await getFormSubmissions(id);

    return (
        <div className={`${styles.page} ${styles.wide}`}>
            <Link href="/" className={styles.backLink}>
                Back to Forms
            </Link>

            <h1 className={styles.pageTitle}>{form.title} — Responses</h1>
            <p className={styles.subtitle}>
                {submissions.length} {submissions.length === 1 ? "response" : "responses"}
            </p>

            {submissions.length === 0 ? (
                <div className={styles.tableWrap}>
                    <p className={styles.empty}>No responses yet</p>
                </div>
            ):(
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Submitted</th>
                                {form.fields.map((field) => (
                                    <th key={field.id}>{field.label}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.submittedAt.toLocaleString()}</td>
                                    {form.fields.map((field) => (
                                        <td key={field.id}>{formatAnswer(s.answers[field.id])}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}