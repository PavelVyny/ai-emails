import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Email } from '../types/email.types';

interface EmailViewerProps {
  email: Email | null;
}

export default function EmailViewer({ email }: EmailViewerProps) {
  if (!email) {
    return (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h6" color="text.secondary">
          Select an email to view
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h4" gutterBottom>
          {email.subject || 'No Subject'}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 1 }}>
            <Chip label={`To: ${email.to}`} variant="outlined" sx={{ mr: 1 }} />
            {email.cc && (
              <Chip label={`CC: ${email.cc}`} variant="outlined" sx={{ mr: 1 }} />
            )}
            {email.bcc && (
              <Chip label={`BCC: ${email.bcc}`} variant="outlined" />
            )}
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            {formatDate(email.created_at)}
          </Typography>
        </Box>
        
        <Box sx={{ 
          whiteSpace: 'pre-wrap', 
          lineHeight: 1.6,
          fontSize: '1rem'
        }}>
          {email.body || 'No content'}
        </Box>
      </Paper>
    </Box>
  );
}
