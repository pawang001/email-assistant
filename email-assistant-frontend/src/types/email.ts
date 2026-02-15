export type GenerateReplyRequest = {
  emailContent: string;
  tone?: string;
};

export type GenerateReplyResponse = {
  reply: string;
};

export type GenerateReplyApiResponse = GenerateReplyResponse | string;
