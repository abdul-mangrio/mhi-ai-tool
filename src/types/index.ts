// AI Provider Types
export interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  costPerToken: number;
}

export type AIProviderType = 'openai' | 'claude' | 'gemini' | 'azure';

// NetSuite Data Types
export interface NetSuiteEntity {
  id: string;
  name: string;
  type: string;
  lastModified: string;
}

export interface Customer extends NetSuiteEntity {
  email: string;
  phone: string;
  status: string;
  totalRevenue: number;
  lastOrderDate: string;
}

export interface SalesOrder extends NetSuiteEntity {
  customerId: string;
  customerName: string;
  amount: number;
  status: string;
  orderDate: string;
  dueDate: string;
}

export interface Invoice extends NetSuiteEntity {
  customerId: string;
  customerName: string;
  amount: number;
  status: string;
  dueDate: string;
  overdueDays: number;
}

export interface InventoryItem extends NetSuiteEntity {
  sku: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  location: string;
}

export interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
}

// Query Processing Types
export interface QueryIntent {
  type: 'financial' | 'sales' | 'inventory' | 'customer' | 'analytics';
  action: string;
  entities: string[];
  parameters: Record<string, any>;
  confidence: number;
}

export interface ProcessedQuery {
  originalQuery: string;
  intent: QueryIntent;
  netSuiteQueries: NetSuiteQuery[];
  aiPrompt: string;
}

export interface NetSuiteQuery {
  endpoint: string;
  parameters: Record<string, any>;
  dataType: string;
}

// Response Types
export interface AIResponse {
  data: any;
  insights: string[];
  visualizations: VisualizationConfig[];
  summary: string;
  recommendations: string[];
  isLoading?: boolean;
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'table' | 'kpi';
  data: any;
  options: Record<string, any>;
  title: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  visualizations?: VisualizationConfig[];
  isLoading?: boolean;
}

// UI State Types
export interface AppState {
  theme: 'light' | 'dark';
  language: string;
  aiProvider: AIProvider | null;
  isAuthenticated: boolean;
  user: User | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// Configuration Types
export interface NetSuiteConfig {
  accountId: string;
  consumerKey: string;
  consumerSecret: string;
  tokenId: string;
  tokenSecret: string;
  baseUrl: string;
}

export interface AppConfig {
  netsuite: NetSuiteConfig;
  aiProviders: AIProvider[];
  features: {
    voiceInput: boolean;
    multiLanguage: boolean;
    exportEnabled: boolean;
    realTimeUpdates: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Analytics Types
export interface QueryAnalytics {
  queryId: string;
  originalQuery: string;
  processingTime: number;
  aiProvider: string;
  cost: number;
  userSatisfaction?: number;
  timestamp: Date;
}
