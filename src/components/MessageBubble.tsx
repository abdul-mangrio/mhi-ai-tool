import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
          maxWidth: '70%'
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32
          }}
        >
          {isUser ? <PersonIcon /> : <BotIcon />}
        </Avatar>

        {/* Message Content */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.main' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          {/* Message Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {isUser ? 'You' : 'NetSuite AI'}
            </Typography>
            <Tooltip title={new Date(message.timestamp).toLocaleString()}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon sx={{ fontSize: 12 }} />
                <Typography variant="caption">
                  {timestamp}
                </Typography>
              </Box>
            </Tooltip>
          </Box>

          {/* Message Content */}
          <Box>
            {message.isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">
                  Processing your request...
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            )}
          </Box>

          {/* Message Footer */}
          {!isUser && message.data && (
            <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                Data retrieved from NetSuite
              </Typography>
            </Box>
          )}

          {/* Insights */}
          {!isUser && message.data?.insights && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                Key Insights:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {message.data.insights.map((insight: string, index: number) => (
                  <Chip
                    key={index}
                    label={insight}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Recommendations */}
          {!isUser && message.data?.recommendations && message.data.recommendations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                Recommendations:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {message.data.recommendations.map((rec: string, index: number) => (
                  <Typography
                    key={index}
                    component="li"
                    variant="caption"
                    sx={{ mb: 0.5 }}
                  >
                    {rec}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageBubble;
