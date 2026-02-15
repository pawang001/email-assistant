import { Box, Button, TextField } from '@mui/material';

type ReplyPanelProps = {
  reply: string;
  copyButtonLabel: string;
  onCopy: () => Promise<void>;
};

function ReplyPanel({ reply, copyButtonLabel, onCopy }: ReplyPanelProps) {
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        label="Generated Reply"
        rows={5}
        value={reply}
        placeholder="Your generated reply will appear here."
        sx={{ mb: 1.25 }}
        inputProps={{ readOnly: true }}
      />

      <Button
        variant="outlined"
        disabled={!reply}
        onClick={onCopy}
        sx={{
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'rgba(96, 165, 250, 0.14)',
          },
        }}
      >
        {copyButtonLabel}
      </Button>
    </Box>
  );
}

export default ReplyPanel;
