import {getOwnedForm, getFormSubmissions} from "../../../actions";
import {formatAnswer} from "../../../../lib/answers";
import {formatDuration} from "../../../../lib/time";

function escapeCell(value: string): string {
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}`:value;
    return `"${safe.replace(/"/g, '')}"`;
}
export async function GET(_request: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const form = await getOwnedForm(id);
    if (!form) return new Response("Not found :(", {status: 404});
    
    const submissions = await getFormSubmissions(id);
    const header = ["Submitted", "Time spent", ...form.fields.map((f) => f.label)];
    const rows = submissions.map((s) => [
        s.submittedAt.toISOString(),
        formatDuration(s.durationMs),
        ...form.fields.map((f) => formatAnswer(s.answers[f.id], "")),
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
