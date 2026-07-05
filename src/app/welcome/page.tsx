import Link from "next/link";
import styles from "./welcome.module.css";

export default function Welcome() {
    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.logo}>Better Forms</h1>
                <p className={styles.tagline}>
                    Build, share, and analyse responses with Better Forms (better than any other forms app!)
                </p>
                <div className={styles.actions}>
                    <Link href="/signin" className={`${styles.button} ${styles.secondary}`}>
                    Sign in 
                    </Link>
                    <Link href="/signup" className={`${styles.button} ${styles.primary}`}>
                        Sign up
                    </Link>
                </div>
            </div>
        </main>
    );
}