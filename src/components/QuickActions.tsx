import React from 'react';
import {
  Box,
  Chip,
  Tooltip
} from '@mui/material';

interface QuickAction {
  label: string;
  query: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (query: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, onActionClick }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {actions.map((action, index) => (
        <Tooltip key={index} title={action.query}>
          <Chip
            label={action.label}
            onClick={() => onActionClick(action.query)}
            clickable
            variant="outlined"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default QuickActions;
