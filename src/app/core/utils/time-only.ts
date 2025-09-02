export function fromApiTime(hhmmss: string): string {
  return hhmmss?.slice(0, 5) ?? '';
}

export function toApiTime(hhmm: string): string {
  return hhmm?.length === 5 ? `${hhmm}:00` : hhmm;
}