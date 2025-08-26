import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, AutoAwesome as AIIcon } from '@mui/icons-material';
import { EmailFormData } from '../types/email.types';
import AIPromptDialog from './AIPromptDialog';

interface ComposeEmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (emailData: EmailFormData) => Promise<void>;
}

export default function ComposeEmailDialog({ 
  open, 
  onClose, 
  onSend 
}: ComposeEmailDialogProps) {
  const [formData, setFormData] = useState<EmailFormData>({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });

  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [routingDecision, setRoutingDecision] = useState<string>('');



  const handleInputChange = (field: keyof EmailFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject) {
      return;
    }

    setLoading(true);
    try {
      await onSend(formData);
      setFormData({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
      });
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async (userInput: string) => {
    console.log('Starting AI generation with input:', userInput);
    setStreaming(true);
    setAiDialogOpen(false); // Close modal immediately
    setRoutingDecision('');
    setFormData(prev => {
      const cleared = { ...prev, subject: '', body: '' };
      console.log('Cleared form data:', cleared);
      return cleared;
    });

    try {
      const response = await fetch('http://localhost:3001/api/ai/stream-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream ended');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('Raw chunk received:', chunk);
        
        // Split by lines and process each line
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6).trim();
            console.log('Processing data:', data);
            
            if (data === '[DONE]') {
              console.log('Stream completed');
              setStreaming(false);
              return;
            }

            if (data && data !== '' && data !== '{}') {
              try {
                const parsed = JSON.parse(data);
                console.log('Parsed streaming chunk:', parsed);
                
                if (parsed.type === 'connected') {
                  console.log('Stream connected successfully');
                } else if (parsed.type === 'routing') {
                  console.log('Router decision:', parsed.content);
                  setRoutingDecision(parsed.content);
                } else if (parsed.type === 'subject') {
                  console.log('Setting subject:', parsed.content);
                  setFormData(prev => {
                    const newData = { ...prev, subject: parsed.content };
                    console.log('Form data after subject update:', newData);
                    return newData;
                  });
                } else if (parsed.type === 'body') {
                  console.log('Setting body:', parsed.content);
                  setFormData(prev => {
                    const newData = { ...prev, body: parsed.content };
                    console.log('Form data after body update:', newData);
                    return newData;
                  });
                } else if (parsed.type === 'error') {
                  console.error('Streaming error:', parsed.content);
                }
              } catch (e) {
                console.warn('Failed to parse JSON:', data, 'Error:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('AI streaming failed:', error);
      setStreaming(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Compose Email</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              fullWidth
              label="To"
              value={formData.to}
              onChange={handleInputChange('to')}
              required
            />

            <TextField
              fullWidth
              label="CC"
              value={formData.cc}
              onChange={handleInputChange('cc')}
            />

            <TextField
              fullWidth
              label="BCC"
              value={formData.bcc}
              onChange={handleInputChange('bcc')}
            />

            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={handleInputChange('subject')}
                required
              />
              <Button
                variant="outlined"
                startIcon={streaming ? <CircularProgress size={16} /> : <AIIcon />}
                onClick={() => setAiDialogOpen(true)}
                disabled={streaming}
                sx={{ 
                  minWidth: 100,
                  height: 56,
                  flexShrink: 0
                }}
              >
                AI ✨
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Body"
              multiline
              rows={8}
              value={formData.body}
              onChange={handleInputChange('body')}
            />

            {/* AI Status Area - Always present to prevent layout shifts */}
            <Box 
              sx={{ 
                minHeight: 40, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 1,
                backgroundColor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              {streaming ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    AI is generating your email...
                  </Typography>
                </Box>
              ) : routingDecision ? (
                <Chip 
                  label={`Generated by ${routingDecision.charAt(0).toUpperCase() + routingDecision.slice(1)} Assistant`}
                  size="small"
                  color="success"
                  variant="filled"
                  icon={<span style={{ fontSize: '14px' }}>✨</span>}
                  sx={{ 
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.disabled" fontStyle="italic">
                  Use AI ✨ button to generate email content
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={loading || !formData.to || !formData.subject}
          >
            {loading ? <CircularProgress size={20} /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      <AIPromptDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </>
  );
}
