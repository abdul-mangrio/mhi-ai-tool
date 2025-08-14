import { QueryIntent, ProcessedQuery, NetSuiteQuery } from '../types';

export class QueryProcessor {
  private financialKeywords = [
    'cash flow', 'revenue', 'profit', 'loss', 'expenses', 'income',
    'accounts receivable', 'accounts payable', 'aging', 'balance sheet',
    'p&l', 'profit and loss', 'financial', 'budget', 'forecast'
  ];

  private salesKeywords = [
    'sales', 'orders', 'customers', 'opportunities', 'pipeline',
    'quotes', 'deals', 'territory', 'performance', 'cycle time',
    'top customers', 'revenue', 'conversion'
  ];

  private inventoryKeywords = [
    'inventory', 'stock', 'items', 'products', 'quantity',
    'reorder point', 'turnover', 'fulfillment', 'purchase orders',
    'suppliers', 'vendors', 'abc analysis'
  ];

  private customerKeywords = [
    'customers', 'contacts', 'leads', 'churn', 'retention',
    'satisfaction', 'lifetime value', 'segments', 'overdue'
  ];

  private analyticsKeywords = [
    'trend', 'analysis', 'comparison', 'variance', 'cohort',
    'predictive', 'forecast', 'kpi', 'dashboard', 'report'
  ];

  async processQuery(naturalLanguageQuery: string): Promise<ProcessedQuery> {
    const intent = await this.parseIntent(naturalLanguageQuery);
    const netSuiteQueries = this.generateNetSuiteQueries(intent, naturalLanguageQuery);
    const aiPrompt = this.buildAIPrompt(naturalLanguageQuery, intent);

    return {
      originalQuery: naturalLanguageQuery,
      intent,
      netSuiteQueries,
      aiPrompt
    };
  }

  private async parseIntent(query: string): Promise<QueryIntent> {
    const lowerQuery = query.toLowerCase();
    
    // Determine query type
    let type: QueryIntent['type'] = 'analytics';
    let confidence = 0.5;

    if (this.hasKeywords(lowerQuery, this.financialKeywords)) {
      type = 'financial';
      confidence = 0.8;
    } else if (this.hasKeywords(lowerQuery, this.salesKeywords)) {
      type = 'sales';
      confidence = 0.8;
    } else if (this.hasKeywords(lowerQuery, this.inventoryKeywords)) {
      type = 'inventory';
      confidence = 0.8;
    } else if (this.hasKeywords(lowerQuery, this.customerKeywords)) {
      type = 'customer';
      confidence = 0.8;
    } else if (this.hasKeywords(lowerQuery, this.analyticsKeywords)) {
      type = 'analytics';
      confidence = 0.7;
    }

    // Extract action
    const action = this.extractAction(lowerQuery);

    // Extract entities
    const entities = this.extractEntities(lowerQuery);

    // Extract parameters
    const parameters = this.extractParameters(lowerQuery);

    return {
      type,
      action,
      entities,
      parameters,
      confidence
    };
  }

  private hasKeywords(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword));
  }

  private extractAction(query: string): string {
    const actionKeywords = [
      'show', 'display', 'get', 'find', 'list', 'generate',
      'create', 'build', 'analyze', 'compare', 'calculate',
      'what is', 'how much', 'which', 'who', 'when'
    ];

    for (const action of actionKeywords) {
      if (query.includes(action)) {
        return action;
      }
    }

    return 'show';
  }

  private extractEntities(query: string): string[] {
    const entities: string[] = [];
    
    // Extract time periods
    const timePatterns = [
      /this month|last month|next month/gi,
      /this quarter|last quarter|next quarter/gi,
      /this year|last year|next year/gi,
      /q[1-4] 20\d{2}/gi,
      /january|february|march|april|may|june|july|august|september|october|november|december/gi
    ];

    timePatterns.forEach(pattern => {
      const matches = query.match(pattern);
      if (matches) {
        entities.push(...matches);
      }
    });

    // Extract amounts
    const amountPattern = /\$\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})? (?:dollars?|k|thousand|million)/gi;
    const amountMatches = query.match(amountPattern);
    if (amountMatches) {
      entities.push(...amountMatches);
    }

    // Extract customer names (simple heuristic)
    const customerPattern = /(?:customer|customers?|client|clients?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
    const customerMatches = query.match(customerPattern);
    if (customerMatches) {
      entities.push(...customerMatches);
    }

    return entities;
  }

  private extractParameters(query: string): Record<string, any> {
    const parameters: Record<string, any> = {};

    // Extract date ranges
    const dateRangeMatch = query.match(/(?:for|in|during)\s+(.+?)(?:\s|$)/i);
    if (dateRangeMatch) {
      parameters.dateRange = dateRangeMatch[1];
    }

    // Extract amount thresholds
    const amountMatch = query.match(/(?:over|above|more than|greater than)\s+(\$\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (amountMatch) {
      parameters.minAmount = parseFloat(amountMatch[1].replace(/[$,]/g, ''));
    }

    // Extract limits
    const limitMatch = query.match(/(?:top|first|limit)\s+(\d+)/i);
    if (limitMatch) {
      parameters.limit = parseInt(limitMatch[1]);
    }

    // Extract status filters
    const statusMatch = query.match(/(?:status|state)\s+(open|closed|pending|approved|overdue)/i);
    if (statusMatch) {
      parameters.status = statusMatch[1];
    }

    return parameters;
  }

  private generateNetSuiteQueries(intent: QueryIntent, originalQuery: string): NetSuiteQuery[] {
    const queries: NetSuiteQuery[] = [];

    switch (intent.type) {
      case 'financial':
        queries.push(...this.generateFinancialQueries(intent, originalQuery));
        break;
      case 'sales':
        queries.push(...this.generateSalesQueries(intent, originalQuery));
        break;
      case 'inventory':
        queries.push(...this.generateInventoryQueries(intent, originalQuery));
        break;
      case 'customer':
        queries.push(...this.generateCustomerQueries(intent, originalQuery));
        break;
      case 'analytics':
        queries.push(...this.generateAnalyticsQueries(intent, originalQuery));
        break;
    }

    return queries;
  }

  private generateFinancialQueries(intent: QueryIntent, query: string): NetSuiteQuery[] {
    const queries: NetSuiteQuery[] = [];

    if (query.includes('cash flow')) {
      queries.push({
        endpoint: '/financial/cashflow',
        parameters: intent.parameters,
        dataType: 'cashFlow'
      });
    }

    if (query.includes('accounts receivable') || query.includes('aging')) {
      queries.push({
        endpoint: '/financial/accounts-receivable',
        parameters: intent.parameters,
        dataType: 'accountsReceivable'
      });
    }

    if (query.includes('p&l') || query.includes('profit and loss')) {
      queries.push({
        endpoint: '/financial/profit-loss',
        parameters: intent.parameters,
        dataType: 'profitLoss'
      });
    }

    return queries;
  }

  private generateSalesQueries(intent: QueryIntent, query: string): NetSuiteQuery[] {
    const queries: NetSuiteQuery[] = [];

    if (query.includes('customers') || query.includes('top')) {
      queries.push({
        endpoint: '/sales/customers',
        parameters: intent.parameters,
        dataType: 'customers'
      });
    }

    if (query.includes('opportunities') || query.includes('pipeline')) {
      queries.push({
        endpoint: '/sales/opportunities',
        parameters: intent.parameters,
        dataType: 'opportunities'
      });
    }

    if (query.includes('orders')) {
      queries.push({
        endpoint: '/sales/orders',
        parameters: intent.parameters,
        dataType: 'orders'
      });
    }

    return queries;
  }

  private generateInventoryQueries(intent: QueryIntent, query: string): NetSuiteQuery[] {
    const queries: NetSuiteQuery[] = [];

    if (query.includes('inventory') || query.includes('stock')) {
      queries.push({
        endpoint: '/inventory/items',
        parameters: intent.parameters,
        dataType: 'inventory'
      });
    }

    if (query.includes('reorder point')) {
      queries.push({
        endpoint: '/inventory/reorder-points',
        parameters: intent.parameters,
        dataType: 'reorderPoints'
      });
    }

    if (query.includes('purchase orders')) {
      queries.push({
        endpoint: '/inventory/purchase-orders',
        parameters: intent.parameters,
        dataType: 'purchaseOrders'
      });
    }

    return queries;
  }

  private generateCustomerQueries(intent: QueryIntent, query: string): NetSuiteQuery[] {
    const queries: NetSuiteQuery[] = [];

    if (query.includes('customers') || query.includes('contacts')) {
      queries.push({
        endpoint: '/customers/list',
        parameters: intent.parameters,
        dataType: 'customers'
      });
    }

    if (query.includes('overdue') || query.includes('churn')) {
      queries.push({
        endpoint: '/customers/overdue',
        parameters: intent.parameters,
        dataType: 'overdueCustomers'
      });
    }

    return queries;
  }

  private generateAnalyticsQueries(intent: QueryIntent, query: string): NetSuiteQuery[] {
    const queries: NetSuiteQuery[] = [];

    if (query.includes('trend') || query.includes('analysis')) {
      queries.push({
        endpoint: '/analytics/trends',
        parameters: intent.parameters,
        dataType: 'trends'
      });
    }

    if (query.includes('comparison')) {
      queries.push({
        endpoint: '/analytics/comparison',
        parameters: intent.parameters,
        dataType: 'comparison'
      });
    }

    return queries;
  }

  private buildAIPrompt(originalQuery: string, intent: QueryIntent): string {
    return `
Analyze the following NetSuite query and provide intelligent insights:

Original Query: "${originalQuery}"
Intent Type: ${intent.type}
Action: ${intent.action}
Entities: ${intent.entities.join(', ')}
Parameters: ${JSON.stringify(intent.parameters)}

Please provide:
1. Key insights from the data
2. Business recommendations
3. Potential risks or opportunities
4. Actionable next steps
5. Relevant visualizations to consider

Focus on providing value-added analysis that helps with business decision-making.
    `.trim();
  }
}
