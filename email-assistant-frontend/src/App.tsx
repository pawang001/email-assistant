import { Alert, Box, Container, Paper, Snackbar, Stack, Typography } from '@mui/material'
import axios from 'axios';
import { useState } from 'react';
import type { GenerateReplyRequest } from './types/email';
import EmailForm from './components/EmailForm';
import ReplyPanel from './components/ReplyPanel';
import { generateReply } from './services/emailService';
import { getApiErrorMessage } from './utils/error';

function App() {
  const MIN_EMAIL_CONTENT_LENGTH = 10;
  const MAX_EMAIL_CONTENT_LENGTH = 5000;

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [copied, setCopied] = useState(false);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  const trimmedEmailContent = emailContent.trim();
  const isTooShort =
    trimmedEmailContent.length > 0 && trimmedEmailContent.length < MIN_EMAIL_CONTENT_LENGTH;
  const isTooLong = trimmedEmailContent.length > MAX_EMAIL_CONTENT_LENGTH;
  const emailContentError = !trimmedEmailContent
    ? 'Email content is required.'
    : isTooShort
      ? `Please enter at least ${MIN_EMAIL_CONTENT_LENGTH} characters.`
        : isTooLong
        ? `Please keep content under ${MAX_EMAIL_CONTENT_LENGTH} characters.`
        : '';
  const isFormValid = !emailContentError;

  const handleSubmit = async () => {
    if (!isFormValid) {
      showSnackbar(emailContentError, 'error');
      return;
    }

    setLoading(true)
    try {
      const payload: GenerateReplyRequest = {
        emailContent,
        tone: tone || undefined,
      }
      const resolvedReply = await generateReply(payload);
      setReply(resolvedReply);
      showSnackbar('Reply generated successfully.', 'success');
      setCopied(false);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = getApiErrorMessage(error);
        showSnackbar(serverMessage || error.message || 'Failed to generate reply.', 'error');

      } else {
        showSnackbar('Unexpected error occurred while generating reply.', 'error');
      }

      setReply('');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 2, md: 3.5 },
        pb: { xs: 2.5, md: 4 },
        background:
          'radial-gradient(circle at 0% 0%, rgba(45, 212, 191, 0.16), transparent 34%), radial-gradient(circle at 100% 0%, rgba(96, 165, 250, 0.2), transparent 42%), linear-gradient(180deg, #050A17 0%, #0B1020 100%)',
        '@keyframes fadeUp': {
          '0%': { opacity: 0, transform: 'translateY(18px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={1.75}>
          <Box sx={{ animation: 'fadeUp 450ms ease both' }} textAlign={'center'}>
            <Typography variant="h2" component="h1" sx={{ mb: 0.5, fontSize: { xs: '1.65rem', sm: '1.95rem' } }}>
              Email Reply Generator
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
              Paste an incoming email, choose a tone, and generate a polished response in seconds.
            </Typography>
          </Box>

          <Paper
            sx={{
              p: { xs: 1.5, md: 2 },
              border: '1px solid rgba(96, 165, 250, 0.22)',
              animation: 'fadeUp 450ms ease both',
              animationDelay: '90ms',
            }}
          >
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Input Email
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1.5, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              Provide the original message and optionally choose a writing tone.
            </Typography>

            <EmailForm
              emailContent={emailContent}
              tone={tone}
              loading={loading}
              isFormValid={isFormValid}
              maxEmailLength={MAX_EMAIL_CONTENT_LENGTH}
              onEmailContentChange={(value) => {
                setEmailContent(value);
              }}
              onToneChange={setTone}
              onSubmit={handleSubmit}
            />
          </Paper>

          <Paper
            sx={{
              p: { xs: 1.5, md: 2 },
              border: '1px solid rgba(45, 212, 191, 0.24)',
              animation: 'fadeUp 450ms ease both',
              animationDelay: '180ms',
            }}
          >
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Generated Reply
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1.5, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
              Review your result and copy it to clipboard when ready.
            </Typography>

            <ReplyPanel
              reply={reply}
              copyButtonLabel={copied ? 'Copied' : 'Copy to Clipboard'}
              onCopy={async () => {
                try {
                  await navigator.clipboard.writeText(reply);
                  setCopied(true);
                  showSnackbar('Copied to clipboard.', 'success');
                  window.setTimeout(() => setCopied(false), 1500);
                } catch {
                  showSnackbar('Copy failed.', 'error');
                }
              }}
            />
          </Paper>
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarSeverity === 'error' ? 4200 : 2600}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>

  )
}

export default App;
