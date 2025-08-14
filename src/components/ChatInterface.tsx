import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Clear as ClearIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import DataVisualization from './DataVisualization';

const ChatInterface: React.FC = () => {
  const { state, sendMessage, messages, clearMessages } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
  };

  const clearChat = () => {
    clearMessages();
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages,
      user: state.user
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netsuite-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickActions = [
    {
      label: 'Cash Flow Q3 2024',
      query: 'Show me the cash flow for Q3 2024'
    },
    {
      label: 'Top Customers',
      query: 'Who are our top 10 customers by revenue this year?'
    },
    {
      label: 'Overdue Invoices',
      query: 'Which customers have overdue invoices over $10,000?'
    },
    {
      label: 'Inventory Status',
      query: 'Which items are below reorder point?'
    },
    {
      label: 'Sales Performance',
      query: 'Generate a sales performance report by territory'
    },
    {
      label: 'Financial Trends',
      query: 'Show me revenue trend analysis for the past 6 months'
    }
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              NetSuite AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask me anything about your NetSuite data
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Clear Chat">
              <IconButton onClick={clearChat} color="inherit">
                <ClearIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Chat">
              <IconButton onClick={exportChat} color="inherit">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <QuickActions actions={quickActions} onActionClick={(query) => sendMessage(query)} />
      </Box>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, minHeight: 0 }}>
        {messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            textAlign: 'center'
          }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Welcome to NetSuite AI Assistant
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ask me questions about your financial data, customers, inventory, or sales performance.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {quickActions.slice(0, 4).map((action, index) => (
                <Chip
                  key={index}
                  label={action.label}
                  onClick={() => sendMessage(action.query)}
                  clickable
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <MessageBubble message={message} />
                {message.visualizations && message.visualizations.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {message.visualizations.map((viz: any, vizIndex: number) => (
                      <DataVisualization key={vizIndex} config={viz} />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your NetSuite data..."
            variant="outlined"
            size="small"
          />
          <Tooltip title={isListening ? 'Stop Recording' : 'Voice Input'}>
            <IconButton
              onClick={toggleVoiceInput}
              color={isListening ? 'error' : 'primary'}
              disabled={!('webkitSpeechRecognition' in window)}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Message">
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* AI Provider Status */}
        {state.aiProvider && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Using: {state.aiProvider.name} ({state.aiProvider.model})
            </Typography>
            <Chip
              label="Active"
              size="small"
              color="success"
              variant="outlined"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatInterface;
