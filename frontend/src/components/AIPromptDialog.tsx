import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';

interface AIPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (userInput: string) => Promise<void>;
}

export default function AIPromptDialog({ 
  open, 
  onClose, 
  onGenerate 
}: AIPromptDialogProps) {
  const [userInput, setUserInput] = useState('');

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    await onGenerate(userInput);
    setUserInput('');
  };

  const handleClose = () => {
    setUserInput('');
    onClose();
  };

  const examplePrompts = [
    'Meeting request for Tuesday',
    'Follow up on last week\'s proposal',
    'Sales pitch for new product',
    'Thank you for the meeting',
    'Checking in on project status',
  ];

  const handleExampleClick = (example: string) => {
    setUserInput(example);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">AI Email Assistant ✨</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Describe what your email should be about, and AI will generate it for you.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            fullWidth
            label="What should this email be about?"
            multiline
            rows={3}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., Meeting request for Tuesday, Follow up on proposal..."
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Quick examples:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {examplePrompts.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  variant="outlined"
                  size="small"
                  onClick={() => handleExampleClick(example)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!userInput.trim()}
        >
          Generate Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}
