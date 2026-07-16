"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {signUp} from "../auth/actions";
import styles from "../../styles/Auth.module.css"; // note to self to make this later

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await signUp(email, password);
        setLoading(false);
        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.logo}>Better Forms</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.error}>{error}</div>}
                    <div>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required/>
                    </div>
                    <div>
                        <label className={styles.label}>Password</label>
                        <input type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Signing in..." : "Sign in!"}
                    </button>
                </form>

                <p className={styles.footer}>
                    Don't have an account? You can <Link href="/signup" className={styles.link}>sign up!</Link>
                </p>
            </div>
        </main>
    )
}