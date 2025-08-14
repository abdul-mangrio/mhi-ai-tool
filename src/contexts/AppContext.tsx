import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { NetSuiteAIAssistant } from '../services/aiAssistant';
import { AIProvider, AppState, ChatMessage, User } from '../types';

interface AppContextType {
  state: AppState;
  aiAssistant: NetSuiteAIAssistant | null;
  messages: ChatMessage[];
  dispatch: React.Dispatch<AppAction>;
  sendMessage: (message: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  updateAIProvider: (provider: AIProvider) => void;
  setActiveAIProvider: (providerId: string) => void;
  updateNetSuiteConfig: (config: any) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_AI_PROVIDER'; payload: AIProvider }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: 'CLEAR_MESSAGES' };

const initialState: AppState = {
  theme: 'light',
  language: 'en',
  aiProvider: null,
  isAuthenticated: false,
  user: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_AI_PROVIDER':
      return { ...state, aiProvider: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [aiAssistant, setAiAssistant] = React.useState<NetSuiteAIAssistant | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  // Initialize AI Assistant
  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Load saved settings from localStorage
        const savedSettings = localStorage.getItem('netsuite-ai-settings');
        let savedActiveProvider = 'openai';
        let savedApiKeys: { [key: string]: string } = {
          openai: process.env.REACT_APP_OPENAI_API_KEY || '',
          claude: process.env.REACT_APP_CLAUDE_API_KEY || '',
          gemini: process.env.REACT_APP_GEMINI_API_KEY || '',
          azure: process.env.REACT_APP_AZURE_OPENAI_API_KEY || ''
        };
        let savedModels: { [key: string]: string } = {
          openai: 'gpt-4',
          claude: 'claude-3-sonnet-20240229',
          gemini: 'gemini-1.5-pro',
          azure: 'gpt-4'
        };
        
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            savedActiveProvider = settings.activeProvider || 'openai';
            savedApiKeys = {
              openai: settings.openaiApiKey || process.env.REACT_APP_OPENAI_API_KEY || '',
              claude: settings.claudeApiKey || process.env.REACT_APP_CLAUDE_API_KEY || '',
              gemini: settings.geminiApiKey || process.env.REACT_APP_GEMINI_API_KEY || '',
              azure: settings.azureOpenaiApiKey || process.env.REACT_APP_AZURE_OPENAI_API_KEY || ''
            };
            savedModels = {
              openai: settings.openaiModel || 'gpt-4',
              claude: settings.claudeModel || 'claude-3-sonnet-20240229',
              gemini: settings.geminiModel || 'gemini-1.5-pro',
              azure: settings.azureModel || 'gpt-4'
            };
          } catch (error) {
            console.error('Error loading saved settings:', error);
          }
        }

        // Debug: Log the API keys (without exposing them)
        console.log('API Keys Status:', {
          openai: savedApiKeys.openai ? `Length: ${savedApiKeys.openai.length}` : 'Not set',
          claude: savedApiKeys.claude ? `Length: ${savedApiKeys.claude.length}` : 'Not set',
          gemini: savedApiKeys.gemini ? `Length: ${savedApiKeys.gemini.length}` : 'Not set',
          azure: savedApiKeys.azure ? `Length: ${savedApiKeys.azure.length}` : 'Not set',
          activeProvider: savedActiveProvider
        });

        // Create providers based on saved settings
        const mockProviders: AIProvider[] = [
          {
            id: 'openai-1',
            name: 'OpenAI',
            apiKey: savedApiKeys.openai,
            model: savedModels.openai,
            isActive: savedActiveProvider === 'openai',
            costPerToken: 0.03
          },
          {
            id: 'claude-1',
            name: 'Claude',
            apiKey: savedApiKeys.claude,
            model: savedModels.claude,
            isActive: savedActiveProvider === 'claude',
            costPerToken: 0.015
          },
          {
            id: 'gemini-1',
            name: 'Google Gemini',
            apiKey: savedApiKeys.gemini,
            model: savedModels.gemini,
            isActive: savedActiveProvider === 'gemini',
            costPerToken: 0.01
          },
          {
            id: 'azure-1',
            name: 'Azure OpenAI',
            apiKey: savedApiKeys.azure,
            model: savedModels.azure,
            isActive: savedActiveProvider === 'azure',
            costPerToken: 0.03
          }
        ];

        const netSuiteConfig = {
          accountId: process.env.REACT_APP_NETSUITE_ACCOUNT_ID || 'demo',
          consumerKey: process.env.REACT_APP_NETSUITE_CONSUMER_KEY || '',
          consumerSecret: process.env.REACT_APP_NETSUITE_CONSUMER_SECRET || '',
          tokenId: process.env.REACT_APP_NETSUITE_TOKEN_ID || '',
          tokenSecret: process.env.REACT_APP_NETSUITE_TOKEN_SECRET || '',
          baseUrl: process.env.REACT_APP_NETSUITE_BASE_URL || 'https://demo.netsuite.com'
        };

        const assistant = new NetSuiteAIAssistant(mockProviders, netSuiteConfig);
        setAiAssistant(assistant);

        // Set the saved active provider
        const activeProvider = mockProviders.find(p => p.isActive);
        if (activeProvider) {
          dispatch({ type: 'SET_AI_PROVIDER', payload: activeProvider });
        }

        // If we have saved settings, also update the assistant with the saved providers
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            const providers: AIProvider[] = [];
            
            if (settings.openaiApiKey) {
              providers.push({
                id: 'openai-1',
                name: 'OpenAI',
                apiKey: settings.openaiApiKey,
                model: settings.openaiModel || 'gpt-4',
                isActive: savedActiveProvider === 'openai',
                costPerToken: 0.03
              });
            }

            if (settings.claudeApiKey) {
              providers.push({
                id: 'claude-1',
                name: 'Claude',
                apiKey: settings.claudeApiKey,
                model: settings.claudeModel || 'claude-3-sonnet-20240229',
                isActive: savedActiveProvider === 'claude',
                costPerToken: 0.015
              });
            }

            if (settings.geminiApiKey) {
              providers.push({
                id: 'gemini-1',
                name: 'Google Gemini',
                apiKey: settings.geminiApiKey,
                model: settings.geminiModel || 'gemini-1.5-pro',
                isActive: savedActiveProvider === 'gemini',
                costPerToken: 0.01
              });
            }

            if (settings.azureOpenaiApiKey) {
              providers.push({
                id: 'azure-1',
                name: 'Azure OpenAI',
                apiKey: settings.azureOpenaiApiKey,
                model: settings.azureModel || 'gpt-4',
                isActive: savedActiveProvider === 'azure',
                costPerToken: 0.03
              });
            }

            // Update the assistant with saved providers
            providers.forEach(provider => {
              assistant.updateAIProvider(provider);
            });

            // Set the active provider in the assistant
            assistant.setActiveAIProvider(savedActiveProvider === 'openai' ? 'openai-1' : 
                                       savedActiveProvider === 'claude' ? 'claude-1' : 
                                       savedActiveProvider === 'gemini' ? 'gemini-1' : 'azure-1');
            
            // Apply CORS proxy setting if saved
            if (settings.useCorsProxy !== undefined) {
              assistant.setUseCorsProxy(settings.useCorsProxy);
              console.log('CORS Proxy setting applied:', settings.useCorsProxy);
            }
          } catch (error) {
            console.error('Error applying saved settings:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize AI Assistant:', error);
      }
    };

    initializeAI();
  }, []);

  const sendMessage = async (message: string) => {
    if (!aiAssistant) {
      console.error('AI Assistant not initialized');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    addMessage(userMessage);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    addMessage(assistantMessage);

    try {
      const response = await aiAssistant.processQuery(message);
      
      // Update assistant message with response
      updateMessage(assistantMessage.id, {
        content: response.summary,
        data: response.data,
        visualizations: response.visualizations,
        isLoading: false
      });
    } catch (error) {
      updateMessage(assistantMessage.id, {
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false
      });
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const updateAIProvider = (provider: AIProvider) => {
    // Update the AI Assistant with the new provider
    if (aiAssistant) {
      aiAssistant.updateAIProvider(provider);
    }
    
    // If this is the active provider, update the state
    if (provider.isActive) {
      dispatch({ type: 'SET_AI_PROVIDER', payload: provider });
    }
  };

  const setActiveAIProvider = (providerId: string) => {
    if (aiAssistant) {
      aiAssistant.setActiveAIProvider(providerId);
      
      // Get the updated providers and find the active one
      const providers = aiAssistant.getAIProviders();
      const activeProvider = providers.find(p => p.isActive);
      
      if (activeProvider) {
        dispatch({ type: 'SET_AI_PROVIDER', payload: activeProvider });
        
        // Save the active provider to localStorage
        const savedSettings = localStorage.getItem('netsuite-ai-settings');
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            const providerName = providerId.includes('openai') ? 'openai' : 
                               providerId.includes('claude') ? 'claude' : 
                               providerId.includes('gemini') ? 'gemini' : 'azure';
            
            settings.activeProvider = providerName;
            localStorage.setItem('netsuite-ai-settings', JSON.stringify(settings));
          } catch (error) {
            console.error('Error saving active provider:', error);
          }
        }
      }
    }
  };

  const updateNetSuiteConfig = (config: any) => {
    // Update the NetSuite configuration in the AI Assistant
    if (aiAssistant) {
      // This would need to be implemented in the NetSuiteAIAssistant class
      console.log('Updating NetSuite config:', config);
    }
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setLanguage = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const value: AppContextType = {
    state,
    aiAssistant,
    messages,
    dispatch,
    sendMessage,
    addMessage,
    updateMessage,
    clearMessages,
    updateAIProvider,
    setActiveAIProvider,
    updateNetSuiteConfig,
    setTheme,
    setLanguage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
