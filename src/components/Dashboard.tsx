import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { state } = useApp();

  // Mock dashboard data
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$2,450,000',
      change: '+12.5%',
      positive: true,
      icon: <MoneyIcon color="primary" />
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+8.2%',
      positive: true,
      icon: <PeopleIcon color="primary" />
    },
    {
      title: 'Inventory Items',
      value: '5,678',
      change: '-2.1%',
      positive: false,
      icon: <InventoryIcon color="primary" />
    },
    {
      title: 'Growth Rate',
      value: '15.3%',
      change: '+3.2%',
      positive: true,
      icon: <TrendingUpIcon color="primary" />
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: '5 items below reorder point',
      icon: <WarningIcon color="warning" />
    },
    {
      type: 'success',
      message: 'All invoices processed on time',
      icon: <CheckCircleIcon color="success" />
    },
    {
      type: 'warning',
      message: '3 customers with overdue payments',
      icon: <WarningIcon color="warning" />
    }
  ];

  const recentActivity = [
    {
      action: 'New customer registered',
      entity: 'Acme Corporation',
      time: '2 hours ago'
    },
    {
      action: 'Invoice generated',
      entity: 'INV-001',
      time: '4 hours ago'
    },
    {
      action: 'Inventory updated',
      entity: 'PROD-001',
      time: '6 hours ago'
    },
    {
      action: 'Sales order approved',
      entity: 'SO-002',
      time: '8 hours ago'
    }
  ];

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {metric.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {metric.title}
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {metric.value}
                </Typography>
                <Chip
                  label={metric.change}
                  size="small"
                  color={metric.positive ? 'success' : 'error'}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Alerts
            </Typography>
            <List>
              {alerts.map((alert, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {alert.icon}
                  </ListItemIcon>
                  <ListItemText primary={alert.message} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={activity.action}
                    secondary={`${activity.entity} • ${activity.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* AI Provider Status */}
      {state.aiProvider && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            AI Assistant Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={state.aiProvider.name}
              color="primary"
              variant="outlined"
            />
            <Typography variant="body2" color="text.secondary">
              Model: {state.aiProvider.model}
            </Typography>
            <Chip
              label="Active"
              color="success"
              size="small"
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
