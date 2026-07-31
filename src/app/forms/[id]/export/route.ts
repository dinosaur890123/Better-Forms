import {getOwnedForm, getFormSubmissions, getFormFieldHistory} from "../../../actions";
import {formatAnswer} from "../../../../lib/answers";
import {formatDuration} from "../../../../lib/time";

function escapeCell(value: string): string {
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}`:value;
    return `"${safe.replace(/"/g, '""')}"`;
}
export async function GET(_request: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const form = await getOwnedForm(id);
    if (!form) return new Response("Not found :(", {status: 404});
    
    const [submissions, history] = await Promise.all([
        getFormSubmissions(id),
        getFormFieldHistory(id),
    ]);
    const columns = history.filter(
        (f) => !f.deleted || submissions.some((s) => s.answers[f.id] !== undefined)
    );

    const header = ["Submitted", "Time spent", ...columns.map((f) => (f.deleted ? `${f.label} (removed)` : f.label))];
    const rows = submissions.map((s) => [
        s.submittedAt.toISOString(),
        formatDuration(s.durationMs),
        ...columns.map((f) => formatAnswer(s.answers[f.id], "")),
    ]);

    const csv = [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const slug = form.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "form";

    return new Response("\uFEFF" + csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${slug}-responses.csv"`,
        },
    });
}
