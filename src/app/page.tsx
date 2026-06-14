import styles from "./page.module.css";
export default function Home() {
  const mockForms = [
    {id: "feedback", title: "Product feedback survey", responses: 12},
    {id: "rsvp", title: "Annual event RSVP", responses: 4},
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Better Forms</div>
        <button className={styles.button}>New Form</button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Your Forms</h1>

        <div className={styles.grid}>
          {mockForms.map((form) => (
            <div key={form.id} className={styles.card}>
              <h3>{form.title}</h3>
              <p>{form.responses} responses</p>
            </div>
          ))}
        </div>
      </main>
    </div>
}