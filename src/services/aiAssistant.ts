import { AIService } from './aiService';
import { NetSuiteService } from './netsuiteService';
import { QueryProcessor } from './queryProcessor';
import { 
  AIResponse, 
  ProcessedQuery, 
  NetSuiteQuery, 
  AIProvider
} from '../types';

export class NetSuiteAIAssistant {
  private aiService: AIService;
  private netSuiteService: NetSuiteService;
  private queryProcessor: QueryProcessor;

  constructor(
    aiProviders: AIProvider[],
    netSuiteConfig: any
  ) {
    this.aiService = new AIService(aiProviders);
    this.netSuiteService = new NetSuiteService(netSuiteConfig);
    this.queryProcessor = new QueryProcessor();
  }

  async processQuery(
    naturalLanguageQuery: string,
    userContext: any = {},
    aiProviderId?: string
  ): Promise<AIResponse> {
    try {
      // Step 1: Parse natural language intent
      const processedQuery = await this.queryProcessor.processQuery(naturalLanguageQuery);
      
      // Step 2: Execute NetSuite queries
      const netSuiteData = await this.executeNetSuiteQueries(processedQuery.netSuiteQueries);
      
      // Step 3: Prepare context for AI analysis
      const aiContext = {
        originalQuery: processedQuery.originalQuery,
        intent: processedQuery.intent,
        netSuiteData,
        userContext
      };

      // Step 5: Process through AI for insights (will automatically use active provider)
      const aiResponse = await this.aiService.processQuery(
        processedQuery.aiPrompt,
        aiContext,
        aiProviderId // Pass the providerId if specified, otherwise will use active provider
      );

      // Step 6: Enhance response with NetSuite data
      return this.enhanceResponse(aiResponse, netSuiteData, processedQuery);

    } catch (error) {
      console.error('AI Assistant processing error:', error);
      throw new Error(`Query processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeNetSuiteQueries(queries: NetSuiteQuery[]): Promise<any> {
    const results: any = {};

    for (const query of queries) {
      try {
        // For demo purposes, use mock data based on query type
        const mockData = await this.getMockDataForQuery(query);
        results[query.dataType] = mockData;
      } catch (error) {
        console.error(`Error executing NetSuite query ${query.endpoint}:`, error);
        results[query.dataType] = { error: 'Failed to retrieve data' };
      }
    }

    return results;
  }

  private async getMockDataForQuery(query: NetSuiteQuery): Promise<any> {
    switch (query.dataType) {
      case 'customers':
        return await this.netSuiteService.getMockCustomers();
      case 'orders':
        return await this.netSuiteService.getMockSalesOrders();
      case 'invoices':
        return await this.netSuiteService.getMockInvoices();
      case 'inventory':
        return await this.netSuiteService.getMockInventory();
      case 'cashFlow':
      case 'profitLoss':
      case 'accountsReceivable':
        return await this.netSuiteService.getMockFinancialData();
      default:
        return [];
    }
  }

  private getActiveAIProvider(): AIProvider | undefined {
    const providers = this.aiService.getAllProviders();
    return providers.find(provider => provider.isActive);
  }

  private enhanceResponse(
    aiResponse: AIResponse,
    netSuiteData: any,
    processedQuery: ProcessedQuery
  ): AIResponse {
    // Add data source information
    const enhancedResponse = {
      ...aiResponse,
      data: {
        ...aiResponse.data,
        netSuiteData,
        queryInfo: {
          originalQuery: processedQuery.originalQuery,
          intent: processedQuery.intent,
          timestamp: new Date().toISOString()
        }
      }
    };

    // Generate additional visualizations based on data type
    if (netSuiteData) {
      enhancedResponse.visualizations = [
        ...enhancedResponse.visualizations,
        ...this.generateDataVisualizations(netSuiteData, processedQuery.intent)
      ];
    }

    return enhancedResponse;
  }

  private generateDataVisualizations(data: any, intent: any): any[] {
    const visualizations: any[] = [];

    // Generate KPI cards for financial data
    if (intent.type === 'financial' && data.cashFlow) {
      const financialData = Array.isArray(data.cashFlow) ? data.cashFlow[0] : data.cashFlow;
      visualizations.push({
        type: 'kpi',
        title: 'Financial Overview',
        data: {
          revenue: financialData.revenue,
          profit: financialData.profit,
          cashFlow: financialData.cashFlow
        },
        options: {
          format: 'currency'
        }
      });
    }

    // Generate bar chart for customer data
    if (intent.type === 'sales' && data.customers) {
      visualizations.push({
        type: 'bar',
        title: 'Top Customers by Revenue',
        data: data.customers
          .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
          .slice(0, 5)
          .map((customer: any) => ({
            name: customer.name,
            value: customer.totalRevenue
          })),
        options: {
          xAxis: 'name',
          yAxis: 'value',
          format: 'currency'
        }
      });
    }

    // Generate line chart for trends
    if (intent.type === 'analytics' && data.cashFlow) {
      visualizations.push({
        type: 'line',
        title: 'Financial Trends',
        data: data.cashFlow.map((item: any) => ({
          period: item.period,
          revenue: item.revenue,
          profit: item.profit
        })),
        options: {
          xAxis: 'period',
          yAxis: ['revenue', 'profit'],
          format: 'currency'
        }
      });
    }

    return visualizations;
  }

  // Utility methods for managing AI providers
  updateAIProvider(provider: AIProvider): void {
    this.aiService.updateProvider(provider);
  }

  getAIProviders(): AIProvider[] {
    return this.aiService.getAllProviders();
  }

  setActiveAIProvider(providerId: string): void {
    const providers = this.aiService.getAllProviders();
    providers.forEach(provider => {
      const updatedProvider = { ...provider, isActive: provider.id === providerId };
      this.aiService.updateProvider(updatedProvider);
    });
  }

  setUseCorsProxy(useProxy: boolean): void {
    this.aiService.setUseCorsProxy(useProxy);
  }

  // Method to handle streaming responses (for real-time updates)
  async processQueryStream(
    query: string,
    userContext: any = {},
    onUpdate: (response: Partial<AIResponse>) => void
  ): Promise<AIResponse> {
    // Initial response
    onUpdate({
      summary: 'Processing your query...',
      insights: ['Analyzing NetSuite data...'],
      isLoading: true
    });

    try {
      const response = await this.processQuery(query, userContext);
      
      // Final response
      onUpdate({
        ...response,
        isLoading: false
      });

      return response;
    } catch (error) {
      onUpdate({
        summary: 'Error processing query',
        insights: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        isLoading: false
      });
      throw error;
    }
  }

  // Method to validate query before processing
  validateQuery(query: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!query || query.trim().length === 0) {
      errors.push('Query cannot be empty');
    }

    if (query.length > 1000) {
      errors.push('Query is too long (maximum 1000 characters)');
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+.+\s+set/i
    ];

    harmfulPatterns.forEach(pattern => {
      if (pattern.test(query)) {
        errors.push('Query contains potentially harmful SQL-like commands');
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
