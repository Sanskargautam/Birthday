import type { IncomingMessage, ServerResponse } from 'node:http';

export function handleGiftPicksApi(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
  searchParams: URLSearchParams,
): Promise<boolean>;
