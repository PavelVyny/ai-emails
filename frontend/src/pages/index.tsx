import React, { useState } from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Layout from '../components/Layout';
import EmailSidebar from '../components/EmailSidebar';
import EmailViewer from '../components/EmailViewer';
import ComposeEmailDialog from '../components/ComposeEmailDialog';
import useEmails from '../hooks/useEmails';
import { Email, EmailFormData } from '../types/email.types';

export default function Home() {
  const { emails, loading, error, createEmail } = useEmails();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const handleSendEmail = async (emailData: EmailFormData) => {
    await createEmail({
      to: emailData.to,
      cc: emailData.cc || undefined,
      bcc: emailData.bcc || undefined,
      subject: emailData.subject,
      body: emailData.body,
    });
  };

  if (loading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;

  return (
    <Layout>
      <EmailSidebar 
        emails={emails}
        selectedEmail={selectedEmail}
        onSelectEmail={setSelectedEmail}
      />
      <EmailViewer email={selectedEmail} />
      
      <Fab
        color="primary"
        aria-label="compose"
        onClick={() => setComposeOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <ComposeEmailDialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSend={handleSendEmail}
      />
    </Layout>
  );
}
