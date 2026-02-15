import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

type EmailFormProps = {
  emailContent: string;
  tone: string;
  loading: boolean;
  isFormValid: boolean;
  maxEmailLength: number;
  onEmailContentChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onSubmit: () => void;
};

function EmailForm({
  emailContent,
  tone,
  loading,
  isFormValid,
  maxEmailLength,
  onEmailContentChange,
  onToneChange,
  onSubmit,
}: EmailFormProps) {
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={5}
        variant="outlined"
        label="Original Email Content"
        value={emailContent}
        onChange={(e) => onEmailContentChange(e.target.value)}
        placeholder="Paste the email you received..."
        helperText={`${emailContent.length}/${maxEmailLength}`}
        inputProps={{ maxLength: maxEmailLength }}
        sx={{ mb: 1.25 }}
      />

      <FormControl fullWidth sx={{ mb: 1.25 }}>
        <InputLabel>Tone (Optional)</InputLabel>
        <Select
          value={tone}
          label="Tone (Optional)"
          onChange={(e) => onToneChange(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="professional">Professional</MenuItem>
          <MenuItem value="casual">Casual</MenuItem>
          <MenuItem value="friendly">Friendly</MenuItem>
          <MenuItem value="angry">Angry</MenuItem>
        </Select>
      </FormControl>

      <LoadingButton
        variant="contained"
        loading={loading}
        disabled={!isFormValid || loading}
        onClick={onSubmit}
        sx={{
          minHeight: 42,
          px: 2.25,
          background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
          color: '#0B1020',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)',
          },
        }}
      >
        Generate Reply
      </LoadingButton>
    </Box>
  );
}

export default EmailForm;
