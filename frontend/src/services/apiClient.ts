interface ValidationIssue {
  loc?: Array<string | number>;
  msg?: string;
  message?: string;
}

function isValidationIssue(value: unknown): value is ValidationIssue {
  return typeof value === 'object' && value !== null;
}

export function formatApiDetail(detail: unknown): string {
  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (!isValidationIssue(item)) return String(item);
        const locationParts = item.loc?.filter((part) => part !== 'body') ?? [];
        const location = locationParts.length > 0 ? locationParts.join(' > ') : '요청 본문';
        const message = item.msg || item.message || '입력값을 확인해주세요.';
        return `${location}: ${message}`;
      })
      .filter(Boolean);

    return messages.length > 0 ? messages.join('\n') : '입력값을 확인해주세요.';
  }

  if (detail && typeof detail === 'object') {
    const maybeMessage = 'message' in detail ? detail.message : 'detail' in detail ? detail.detail : null;
    if (typeof maybeMessage === 'string') return maybeMessage;
    return JSON.stringify(detail, null, 2);
  }

  return '요청을 처리하지 못했습니다.';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null) as unknown;

  if (!response.ok) {
    const detail = data && typeof data === 'object' && 'detail' in data ? data.detail : data;
    throw new Error(formatApiDetail(detail));
  }

  return data as T;
}
