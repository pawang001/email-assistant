import axios from 'axios';
import type { GenerateReplyApiResponse, GenerateReplyRequest } from '../types/email';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not set');
}

export async function generateReply(payload: GenerateReplyRequest): Promise<string> {
  const response = await axios.post<GenerateReplyApiResponse>(
    `${apiBaseUrl}/api/email/generate`,
    payload
  );

  const resolvedReply =
    typeof response.data === 'string' ? response.data : response.data.reply;

  if (!resolvedReply) {
    throw new Error('Empty reply received from server.');
  }

  return resolvedReply;
}
