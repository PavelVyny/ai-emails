import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography,
  Divider
} from '@mui/material';
import { Email } from '../types/email.types';

interface EmailSidebarProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export default function EmailSidebar({ 
  emails, 
  selectedEmail, 
  onSelectEmail 
}: EmailSidebarProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 50): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Emails</Typography>
      </Box>
      
      <List sx={{ p: 0 }}>
        {emails.map((email) => (
          <Box key={email.id}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedEmail?.id === email.id}
                onClick={() => onSelectEmail(email)}
                sx={{ p: 2 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" noWrap>
                      {email.subject || 'No Subject'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        To: {truncateText(email.to)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(email.created_at)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
