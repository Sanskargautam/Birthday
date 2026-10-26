export type GiftPickPayload = {
  name: string;
  gifts: string[];
  giftIds: string[];
  whisper: string;
};

export async function saveGiftPicks(payload: GiftPickPayload): Promise<{ ok: true; iso: string }> {
  const res = await fetch('/api/gift-picks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; iso?: string; error?: string };
  if (!res.ok || !data.ok || !data.iso) {
    throw new Error(data.error || 'save_failed');
  }
  return { ok: true, iso: data.iso };
}
