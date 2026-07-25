export function formatDuration(ms: number | null | undefined): string {
    if (ms === null || ms === undefined) return "—";

    const totalSeconds = Math.round(ms/1000);
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds/60);

    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}`;
}