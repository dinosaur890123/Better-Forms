import Link from "next/link";
import {getOwnedForm, getFormSubmissions} from "../../../actions";
import {FormField} from "../../../../types/form";
import styles from "../../../../styles/Analytics.module.css"; // reminder to self

function Bar({label, count, total}: {label: string; count: number; total: number}) {
    const percent = total > 0 ? Math.round((count/total) * 100) : 0;
    return (
        <div className={styles.barRow}>
            <div className={styles.barLabel} title={label}>{label}</div>
            <div className={styles.barTrack}>
        <div className={styles.barFill} style={{width: `${percent}%`}} />
        </div>
        
        <div className={styles.barValue}>{count} ({percent}%)</div>
        </div>
    );
}

function FieldAnalytics({field, values, total}: {field: FormField; values: any[]; total: number}) {
    if (field.type === "rating") {
        const numbers = values.map(Number).filter((n) => !isNaN(n));
        const average = numbers.length ? numbers.reduce((a,b) => a+b, 0) / numbers.length:0;

        return (
            <>
            <div className={styles.stat}>{average.toFixed(1)} <span className={styles.statUnit}>average rating</span></div>

            {[5, 4, 3, 2, 1].map((star) => (
                <Bar key={star} label={`${star} ★`} count={numbers.filter((n) => n === star).length} total={total} />
            ))}
            
            </>
        );
    }
    if (field.type === "choice") {
        return (
            <>
            {(field.options || []).map((opt) => (
                <Bar key={opt} label={opt} count={values.filter((v) => v === opt).length} total={total}/>
            ))}
            </>
        );
    }

    if (field.type === "checkbox") {
        const yes = values.filter((v) => v === true|| v === "true").length;
        return (
            <>
                <Bar label="Checked" count={yes} total={total}/>
                <Bar label="Unchecked" count={total-yes} total={total} />
            </>
        );
    }

    return <div className={styles.textSummary}>{values.length} of {total} answered this question</div>;
}

export default async function AnalyticsPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const form = await getOwnedForm(id);
    if (!form) notFound();
    const submissions = await getFormSubmissions(id);
    const total = submissions.length;

    return (
        <div className={styles.page}>
            <Link href="/dashboard" className={styles.backLink}>Back to forms</Link>
            <h1 className={styles.pageTitle}>{form.title} — Analytics</h1>
            <p className={styles.subtitle}>{total} total {total === 1 ? "response" : "responses"}</p>

            {total === 0 ? (
                <div className={styles.empty}>There aren't responses yet, analytics will show once more people submit a response.</div>
            ):(
                <div className={styles.grid}>
                    {form.fields.map((field) => {
                        const values = submissions.map((s) => s.answers[field.id]).filter((v) => v !== undefined && v !== null && v !== "");

                        return (
                            <div key={field.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.fieldLabel}>{field.label}</h3>
                                    <span className={styles.badge}>Field</span>
                                </div>             
                                <FieldAnalytics field={field} values={values} total={total}/>                   
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}