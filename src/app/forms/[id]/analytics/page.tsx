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

function FieldAnalytics