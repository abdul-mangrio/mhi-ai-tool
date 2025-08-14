import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const drawerWidth = 240;

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();

  const menuItems = [
    {
      text: 'AI Assistant',
      icon: <ChatIcon />,
      path: '/'
    },
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings'
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <BotIcon color="primary" />
          <Typography variant="h6" color="primary">
            NetSuite AI
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Intelligent ERP Assistant
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        {state.aiProvider && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              AI Provider
            </Typography>
            <Chip
              label={state.aiProvider.name}
              size="small"
              color="success"
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Model: {state.aiProvider.model}
            </Typography>
          </Box>
        )}
        
        <Typography variant="caption" color="text.secondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Navigation;
