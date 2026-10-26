export type GiftPickPayload = {
  name: string;
  gifts: string[];
  giftIds: string[];
  whisper: string;
};

const SAVE_TIMEOUT_MS = 90_000;

export async function saveGiftPicks(payload: GiftPickPayload): Promise<{ ok: true; iso: string }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SAVE_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch('/api/gift-picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; iso?: string; error?: string };
  if (!res.ok || !data.ok || !data.iso) {
    throw new Error(data.error || 'save_failed');
  }
  return { ok: true, iso: data.iso };
}
