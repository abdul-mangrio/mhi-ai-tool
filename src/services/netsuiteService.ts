import axios from 'axios';
import { NetSuiteConfig, NetSuiteQuery, Customer, SalesOrder, Invoice, InventoryItem, FinancialData } from '../types';

export class NetSuiteService {
  private config: NetSuiteConfig;
  private baseUrl: string;

  constructor(config: NetSuiteConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl;
  }

  async executeQuery(query: NetSuiteQuery): Promise<any> {
    try {
      const headers = this.getAuthHeaders();
      const response = await axios.get(`${this.baseUrl}${query.endpoint}`, {
        headers,
        params: query.parameters
      });

      return this.transformResponse(response.data, query.dataType);
    } catch (error) {
      console.error('NetSuite API error:', error);
      throw new Error(`NetSuite API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getAuthHeaders(): Record<string, string> {
    // OAuth 1.0a signature for NetSuite REST API
    // In a real implementation, you would use a proper OAuth library
    return {
      'Authorization': `OAuth realm="${this.config.accountId}", oauth_consumer_key="${this.config.consumerKey}", oauth_token="${this.config.tokenId}", oauth_signature_method="HMAC-SHA256", oauth_timestamp="${Math.floor(Date.now() / 1000)}", oauth_nonce="${Math.random().toString(36).substring(2)}", oauth_version="1.0"`,
      'Content-Type': 'application/json'
    };
  }

  private transformResponse(data: any, dataType: string): any {
    switch (dataType) {
      case 'customers':
        return this.transformCustomers(data);
      case 'orders':
        return this.transformSalesOrders(data);
      case 'invoices':
        return this.transformInvoices(data);
      case 'inventory':
        return this.transformInventory(data);
      case 'cashFlow':
        return this.transformFinancialData(data);
      default:
        return data;
    }
  }

  private transformCustomers(data: any[]): Customer[] {
    return data.map(item => ({
      id: item.id,
      name: item.entityid || item.companyname,
      type: 'customer',
      lastModified: item.lastmodifieddate,
      email: item.email || '',
      phone: item.phone || '',
      status: item.status || 'active',
      totalRevenue: parseFloat(item.totalrevenue || '0'),
      lastOrderDate: item.lastorderdate || ''
    }));
  }

  private transformSalesOrders(data: any[]): SalesOrder[] {
    return data.map(item => ({
      id: item.id,
      name: item.tranid,
      type: 'salesorder',
      lastModified: item.lastmodifieddate,
      customerId: item.entity,
      customerName: item.entityname,
      amount: parseFloat(item.total || '0'),
      status: item.status,
      orderDate: item.trandate,
      dueDate: item.duedate || item.trandate
    }));
  }

  private transformInvoices(data: any[]): Invoice[] {
    return data.map(item => ({
      id: item.id,
      name: item.tranid,
      type: 'invoice',
      lastModified: item.lastmodifieddate,
      customerId: item.entity,
      customerName: item.entityname,
      amount: parseFloat(item.total || '0'),
      status: item.status,
      dueDate: item.duedate,
      overdueDays: this.calculateOverdueDays(item.duedate)
    }));
  }

  private transformInventory(data: any[]): InventoryItem[] {
    return data.map(item => ({
      id: item.id,
      name: item.itemid,
      type: 'inventoryitem',
      lastModified: item.lastmodifieddate,
      sku: item.itemid,
      category: item.itemtype || 'inventory',
      quantity: parseInt(item.quantityavailable || '0'),
      reorderPoint: parseInt(item.reorderpoint || '0'),
      unitCost: parseFloat(item.averagecost || '0'),
      location: item.location || 'Main'
    }));
  }

  private transformFinancialData(data: any): FinancialData[] {
    if (Array.isArray(data)) {
      return data.map(item => ({
        period: item.period || item.trandate,
        revenue: parseFloat(item.revenue || '0'),
        expenses: parseFloat(item.expenses || '0'),
        profit: parseFloat(item.profit || '0'),
        cashFlow: parseFloat(item.cashflow || '0')
      }));
    }
    
    return [{
      period: data.period || new Date().toISOString(),
      revenue: parseFloat(data.revenue || '0'),
      expenses: parseFloat(data.expenses || '0'),
      profit: parseFloat(data.profit || '0'),
      cashFlow: parseFloat(data.cashflow || '0')
    }];
  }

  private calculateOverdueDays(dueDate: string): number {
    if (!dueDate) return 0;
    
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  // Mock data methods for development/demo purposes
  async getMockCustomers(): Promise<Customer[]> {
    return [
      {
        id: '1',
        name: 'Acme Corporation',
        type: 'customer',
        lastModified: '2024-01-15T10:30:00Z',
        email: 'contact@acme.com',
        phone: '+1-555-0123',
        status: 'active',
        totalRevenue: 1250000.00,
        lastOrderDate: '2024-01-10'
      },
      {
        id: '2',
        name: 'TechStart Inc',
        type: 'customer',
        lastModified: '2024-01-14T14:20:00Z',
        email: 'sales@techstart.com',
        phone: '+1-555-0456',
        status: 'active',
        totalRevenue: 850000.00,
        lastOrderDate: '2024-01-12'
      },
      {
        id: '3',
        name: 'Global Solutions Ltd',
        type: 'customer',
        lastModified: '2024-01-13T09:15:00Z',
        email: 'info@globalsolutions.com',
        phone: '+1-555-0789',
        status: 'inactive',
        totalRevenue: 2100000.00,
        lastOrderDate: '2023-12-20'
      }
    ];
  }

  async getMockSalesOrders(): Promise<SalesOrder[]> {
    return [
      {
        id: '1',
        name: 'SO-001',
        type: 'salesorder',
        lastModified: '2024-01-15T11:00:00Z',
        customerId: '1',
        customerName: 'Acme Corporation',
        amount: 50000.00,
        status: 'pending_approval',
        orderDate: '2024-01-15',
        dueDate: '2024-02-15'
      },
      {
        id: '2',
        name: 'SO-002',
        type: 'salesorder',
        lastModified: '2024-01-14T16:30:00Z',
        customerId: '2',
        customerName: 'TechStart Inc',
        amount: 75000.00,
        status: 'pending_fulfillment',
        orderDate: '2024-01-14',
        dueDate: '2024-02-14'
      }
    ];
  }

  async getMockInvoices(): Promise<Invoice[]> {
    return [
      {
        id: '1',
        name: 'INV-001',
        type: 'invoice',
        lastModified: '2024-01-10T10:00:00Z',
        customerId: '1',
        customerName: 'Acme Corporation',
        amount: 50000.00,
        status: 'pending_approval',
        dueDate: '2024-02-10',
        overdueDays: 0
      },
      {
        id: '2',
        name: 'INV-002',
        type: 'invoice',
        lastModified: '2023-12-15T14:00:00Z',
        customerId: '3',
        customerName: 'Global Solutions Ltd',
        amount: 100000.00,
        status: 'pending_approval',
        dueDate: '2024-01-15',
        overdueDays: 0
      }
    ];
  }

  async getMockInventory(): Promise<InventoryItem[]> {
    return [
      {
        id: '1',
        name: 'PROD-001',
        type: 'inventoryitem',
        lastModified: '2024-01-15T12:00:00Z',
        sku: 'PROD-001',
        category: 'electronics',
        quantity: 150,
        reorderPoint: 50,
        unitCost: 25.00,
        location: 'Main Warehouse'
      },
      {
        id: '2',
        name: 'PROD-002',
        type: 'inventoryitem',
        lastModified: '2024-01-14T15:30:00Z',
        sku: 'PROD-002',
        category: 'office supplies',
        quantity: 25,
        reorderPoint: 100,
        unitCost: 10.00,
        location: 'Main Warehouse'
      }
    ];
  }

  async getMockFinancialData(): Promise<FinancialData[]> {
    return [
      {
        period: '2024-01',
        revenue: 500000.00,
        expenses: 350000.00,
        profit: 150000.00,
        cashFlow: 120000.00
      },
      {
        period: '2024-02',
        revenue: 550000.00,
        expenses: 375000.00,
        profit: 175000.00,
        cashFlow: 140000.00
      },
      {
        period: '2024-03',
        revenue: 600000.00,
        expenses: 400000.00,
        profit: 200000.00,
        cashFlow: 180000.00
      }
    ];
  }
}
