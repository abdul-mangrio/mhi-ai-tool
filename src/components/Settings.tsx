import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useApp } from '../contexts/AppContext';
import { AIProvider } from '../types';

const Settings: React.FC = () => {
  const { state, updateAIProvider, setActiveAIProvider, updateNetSuiteConfig, setTheme, setLanguage, aiAssistant } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [useCorsProxy, setUseCorsProxy] = useState(false);
  
  // State for form values
  const [openaiApiKey, setOpenaiApiKey] = useState(process.env.REACT_APP_OPENAI_API_KEY || '');
  const [claudeApiKey, setClaudeApiKey] = useState(process.env.REACT_APP_CLAUDE_API_KEY || '');
  const [geminiApiKey, setGeminiApiKey] = useState(process.env.REACT_APP_GEMINI_API_KEY || '');
  const [azureOpenaiApiKey, setAzureOpenaiApiKey] = useState(process.env.REACT_APP_AZURE_OPENAI_API_KEY || '');
  
  // AI Provider selection
  const [activeProvider, setActiveProvider] = useState('openai');
  const [openaiModel, setOpenaiModel] = useState('gpt-4');
  const [claudeModel, setClaudeModel] = useState('claude-3-sonnet-20240229');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-pro');
  const [azureModel, setAzureModel] = useState('gpt-4');
  
  const [netsuiteAccountId, setNetsuiteAccountId] = useState(process.env.REACT_APP_NETSUITE_ACCOUNT_ID || '');
  const [netsuiteConsumerKey, setNetsuiteConsumerKey] = useState(process.env.REACT_APP_NETSUITE_CONSUMER_KEY || '');
  const [netsuiteConsumerSecret, setNetsuiteConsumerSecret] = useState(process.env.REACT_APP_NETSUITE_CONSUMER_SECRET || '');
  const [netsuiteTokenId, setNetsuiteTokenId] = useState(process.env.REACT_APP_NETSUITE_TOKEN_ID || '');
  const [netsuiteTokenSecret, setNetsuiteTokenSecret] = useState(process.env.REACT_APP_NETSUITE_TOKEN_SECRET || '');

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('netsuite-ai-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setOpenaiApiKey(settings.openaiApiKey || '');
        setClaudeApiKey(settings.claudeApiKey || '');
        setGeminiApiKey(settings.geminiApiKey || '');
        setAzureOpenaiApiKey(settings.azureOpenaiApiKey || '');
        setActiveProvider(settings.activeProvider || 'openai');
                 setOpenaiModel(settings.openaiModel || 'gpt-4');
         setClaudeModel(settings.claudeModel || 'claude-3-sonnet-20240229');
         setGeminiModel(settings.geminiModel || 'gemini-1.5-pro');
         setAzureModel(settings.azureModel || 'gpt-4');
        setNetsuiteAccountId(settings.netsuiteAccountId || '');
        setNetsuiteConsumerKey(settings.netsuiteConsumerKey || '');
        setNetsuiteConsumerSecret(settings.netsuiteConsumerSecret || '');
        setNetsuiteTokenId(settings.netsuiteTokenId || '');
                 setNetsuiteTokenSecret(settings.netsuiteTokenSecret || '');
         setUseCorsProxy(settings.useCorsProxy || false);
       } catch (error) {
         console.error('Error loading saved settings:', error);
       }
     }
   }, []);

  const handleProviderChange = (newProvider: string) => {
    setActiveProvider(newProvider);
    
    // Immediately save the active provider to localStorage
    const savedSettings = localStorage.getItem('netsuite-ai-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        settings.activeProvider = newProvider;
        localStorage.setItem('netsuite-ai-settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving active provider:', error);
      }
    }
  };

  const handleSave = () => {
    // Create all AI providers with their respective API keys and models
    const providers: AIProvider[] = [];
    
    if (openaiApiKey) {
      providers.push({
        id: 'openai-1',
        name: 'OpenAI',
        apiKey: openaiApiKey,
        model: openaiModel,
        isActive: activeProvider === 'openai',
        costPerToken: 0.03
      });
    }

    if (claudeApiKey) {
      providers.push({
        id: 'claude-1',
        name: 'Claude',
        apiKey: claudeApiKey,
        model: claudeModel,
        isActive: activeProvider === 'claude',
        costPerToken: 0.015
      });
    }

    if (geminiApiKey) {
      providers.push({
        id: 'gemini-1',
        name: 'Google Gemini',
        apiKey: geminiApiKey,
        model: geminiModel,
        isActive: activeProvider === 'gemini',
        costPerToken: 0.01
      });
    }

    if (azureOpenaiApiKey) {
      providers.push({
        id: 'azure-1',
        name: 'Azure OpenAI',
        apiKey: azureOpenaiApiKey,
        model: azureModel,
        isActive: activeProvider === 'azure',
        costPerToken: 0.03
      });
    }

    // Update all providers in the AI Assistant
    providers.forEach(provider => {
      updateAIProvider(provider);
    });

    // Set the active provider
    setActiveAIProvider(activeProvider === 'openai' ? 'openai-1' : 
                       activeProvider === 'claude' ? 'claude-1' : 
                       activeProvider === 'gemini' ? 'gemini-1' : 'azure-1');

         // Update NetSuite configuration
     const netSuiteConfig = {
       accountId: netsuiteAccountId,
       consumerKey: netsuiteConsumerKey,
       consumerSecret: netsuiteConsumerSecret,
       tokenId: netsuiteTokenId,
       tokenSecret: netsuiteTokenSecret,
       baseUrl: 'https://demo.netsuite.com' // This could be made configurable
     };
     updateNetSuiteConfig(netSuiteConfig);

     // Update CORS proxy setting
     if (aiAssistant) {
       aiAssistant.setUseCorsProxy(useCorsProxy);
     }

         // Save to localStorage for persistence
     localStorage.setItem('netsuite-ai-settings', JSON.stringify({
       openaiApiKey,
       claudeApiKey,
       geminiApiKey,
       azureOpenaiApiKey,
       activeProvider,
       openaiModel,
       claudeModel,
       geminiModel,
       azureModel,
       netsuiteAccountId,
       netsuiteConsumerKey,
       netsuiteConsumerSecret,
       netsuiteTokenId,
       netsuiteTokenSecret,
       useCorsProxy
     }));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* AI Provider Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Provider Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure your AI providers and select which one to use for queries. Only one provider can be active at a time.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Currently configuring: <strong>{activeProvider.toUpperCase()}</strong>. Other provider settings are preserved but hidden.
            </Alert>
            
            {/* Active Provider Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Active AI Provider</InputLabel>
              <Select
                value={activeProvider}
                label="Active AI Provider"
                onChange={(e) => handleProviderChange(e.target.value)}
              >
                <MenuItem value="openai">OpenAI</MenuItem>
                <MenuItem value="claude">Claude</MenuItem>
                <MenuItem value="gemini">Google Gemini</MenuItem>
                <MenuItem value="azure">Azure OpenAI</MenuItem>
              </Select>
            </FormControl>

            {/* Dynamic Provider Configuration */}
            {activeProvider === 'openai' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  OpenAI Configuration
                </Typography>
                <TextField
                  fullWidth
                  label="OpenAI API Key"
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="OpenAI Model"
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  margin="normal"
                />
              </>
            )}

            {activeProvider === 'claude' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Claude Configuration
                </Typography>
                <TextField
                  fullWidth
                  label="Claude API Key"
                  type="password"
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Claude Model"
                  value={claudeModel}
                  onChange={(e) => setClaudeModel(e.target.value)}
                  margin="normal"
                />
              </>
            )}

            {activeProvider === 'gemini' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Google Gemini Configuration
                </Typography>
                <TextField
                  fullWidth
                  label="Gemini API Key"
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Gemini Model"
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  margin="normal"
                />
              </>
            )}

            {activeProvider === 'azure' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Azure OpenAI Configuration
                </Typography>
                <TextField
                  fullWidth
                  label="Azure OpenAI API Key"
                  type="password"
                  value={azureOpenaiApiKey}
                  onChange={(e) => setAzureOpenaiApiKey(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Azure OpenAI Model"
                  value={azureModel}
                  onChange={(e) => setAzureModel(e.target.value)}
                  margin="normal"
                />
              </>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Active Provider:
              </Typography>
              <Chip
                label={`${activeProvider.toUpperCase()} ${state.aiProvider ? `(${state.aiProvider.model})` : ''}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                This provider will be used for all AI queries. Save settings to apply changes.
              </Typography>
              
              {/* Show which provider is being configured */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                💡 Tip: Switch between providers using the dropdown above to configure different AI services.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* NetSuite Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              NetSuite Configuration
            </Typography>
            
            <TextField
              fullWidth
              label="Account ID"
              value={netsuiteAccountId}
              onChange={(e) => setNetsuiteAccountId(e.target.value)}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Consumer Key"
              type="password"
              value={netsuiteConsumerKey}
              onChange={(e) => setNetsuiteConsumerKey(e.target.value)}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Consumer Secret"
              type="password"
              value={netsuiteConsumerSecret}
              onChange={(e) => setNetsuiteConsumerSecret(e.target.value)}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Token ID"
              type="password"
              value={netsuiteTokenId}
              onChange={(e) => setNetsuiteTokenId(e.target.value)}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Token Secret"
              type="password"
              value={netsuiteTokenSecret}
              onChange={(e) => setNetsuiteTokenSecret(e.target.value)}
              margin="normal"
            />
          </Paper>
        </Grid>

        {/* User Preferences */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Preferences
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={state.theme === 'dark'}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                />
              }
              label="Dark Theme"
            />
            
            <TextField
              fullWidth
              select
              label="Language"
              value={state.language}
              onChange={(e) => setLanguage(e.target.value)}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </TextField>
          </Paper>
        </Grid>

                 {/* Feature Toggles */}
         <Grid item xs={12} md={6}>
           <Paper sx={{ p: 3 }}>
             <Typography variant="h6" gutterBottom>
               Feature Toggles
             </Typography>
             
             <FormControlLabel
               control={<Switch defaultChecked />}
               label="Voice Input"
             />
             
             <FormControlLabel
               control={<Switch defaultChecked />}
               label="Multi-language Support"
             />
             
             <FormControlLabel
               control={<Switch defaultChecked />}
               label="Export Functionality"
             />
             
             <FormControlLabel
               control={<Switch defaultChecked />}
               label="Real-time Updates"
             />

             <FormControlLabel
               control={
                 <Switch
                   checked={useCorsProxy}
                   onChange={(e) => setUseCorsProxy(e.target.checked)}
                 />
               }
               label="Use CORS Proxy (for development)"
             />
             
             <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
               Enable this to bypass CORS issues during development. Not needed for production deployment.
             </Typography>
           </Paper>
         </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
        <Button variant="outlined">
          Reset to Defaults
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
