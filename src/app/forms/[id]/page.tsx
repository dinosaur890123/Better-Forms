import {notFound} from "next/navigation";
import {getPublicForm} from "../../actions";
import PublicForm from "../../../components/PublicForm";
import styles from "../../../styles/PublicPage.module.css";

export const dynamic = "force-dynamic";

export default async function PublicFormPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    const form = await getPublicForm(id);

    if (!form) notFound();
    return (
        <div className={styles.page}>
            <PublicForm form={form} />
        </div>
    )
}