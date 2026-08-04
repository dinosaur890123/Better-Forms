import Link from "next/link";
import {notFound} from "next/navigation";
import {getOwnedForm, getFormSubmissions, getFormFieldHistory} from "../../../actions";
import {formatAnswer} from "../../../../lib/answers";
import styles from "../../../../styles/PublicPage.module.css";
import {formatDuration} from "../../../../lib/time";
import {FIELD_TYPES} from "../../../../lib/fieldTypes";
export const dynamic = "force-dynamic";

export default async function ResponsesPage({
    params,
}:{
    params: Promise<{id: string}>;
}) {
    const {id} = await params;
    const form = await getOwnedForm(id);
    if (!form) notFound();
    const [submissions, history] = await Promise.all([
        getFormSubmissions(id),
        getFormFieldHistory(id),
    ]);

    const columns = history.filter(
        (field) => FIELD_TYPES[field.type]?.answerable && (!field.deleted || submissions.some((s) => s.answers[field.id] !== undefined))
    );

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
                                <th>Time spent</th>
                                {columns.map((field) => (
                                    <th key={field.id}>
                                        {field.label}
                                        {field.deleted && <span className={styles.removedTag}>removed</span>}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.submittedAt.toLocaleString()}</td>
                                    <td>{formatDuration(s.durationMs)}</td>
                                    {columns.map((field) => (
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