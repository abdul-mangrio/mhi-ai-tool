import axios from 'axios';
import { AIProvider, AIResponse } from '../types';

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private useCorsProxy: boolean = false; // Set to true to use CORS proxy

  constructor(providers: AIProvider[]) {
    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  // Method to toggle CORS proxy
  setUseCorsProxy(useProxy: boolean) {
    this.useCorsProxy = useProxy;
  }

  async processQuery(
    query: string,
    context: any,
    providerId?: string
  ): Promise<AIResponse> {
    // If no providerId is specified, use the active provider
    let provider: AIProvider | undefined;
    
    if (providerId) {
      provider = this.providers.get(providerId);
    } else {
      // Get the active provider
      provider = this.getActiveProvider();
    }
    
    if (!provider) {
      throw new Error('No active AI provider found. Please configure an AI provider in settings.');
    }

    const prompt = this.buildPrompt(query, context);
    
    try {
      switch (provider.name.toLowerCase()) {
        case 'openai':
          return await this.callOpenAI(prompt, provider);
        case 'claude':
          return await this.callClaude(prompt, provider);
        case 'gemini':
          return await this.callGemini(prompt, provider);
        case 'azure':
        case 'azure openai':
          return await this.callAzureOpenAI(prompt, provider);
        default:
          throw new Error(`Unsupported AI provider: ${provider.name}`);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error(`AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(query: string, context: any): string {
    return `
You are an intelligent NetSuite ERP assistant. Analyze the following query and provide insights, data analysis, and recommendations.

Query: "${query}"

Context: ${JSON.stringify(context, null, 2)}

Please provide your response in the following JSON format:
{
  "data": "structured data or analysis results",
  "insights": ["key insight 1", "key insight 2", "key insight 3"],
  "summary": "executive summary of findings",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "visualizations": [
    {
      "type": "chart_type",
      "title": "chart_title",
      "data": "chart_data"
    }
  ]
}

Focus on providing actionable business intelligence and clear insights that help with decision-making.
    `.trim();
  }

  private async callOpenAI(prompt: string, provider: AIProvider): Promise<AIResponse> {
    const url = this.useCorsProxy 
      ? 'https://cors-anywhere.herokuapp.com/https://api.openai.com/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(
      url,
      {
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: 'You are a NetSuite ERP expert assistant. Provide accurate, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return this.parseAIResponse(content);
  }

  private async callClaude(prompt: string, provider: AIProvider): Promise<AIResponse> {
    const url = this.useCorsProxy 
      ? 'https://cors-anywhere.herokuapp.com/https://api.anthropic.com/v1/messages'
      : 'https://api.anthropic.com/v1/messages';

    const response = await axios.post(
      url,
      {
        model: provider.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': provider.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const content = response.data.content[0].text;
    return this.parseAIResponse(content);
  }

  private async callGemini(prompt: string, provider: AIProvider): Promise<AIResponse> {
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${provider.apiKey}`;
    const url = this.useCorsProxy 
      ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
      : baseUrl;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    return this.parseAIResponse(content);
  }

  private async callAzureOpenAI(prompt: string, provider: AIProvider): Promise<AIResponse> {
    const baseUrl = `${provider.apiKey}/openai/deployments/${provider.model}/chat/completions?api-version=2023-05-15`;
    const url = this.useCorsProxy 
      ? `https://cors-anywhere.herokuapp.com/${baseUrl}`
      : baseUrl;

    const response = await axios.post(
      url,
      {
        messages: [
          {
            role: 'system',
            content: 'You are a NetSuite ERP expert assistant. Provide accurate, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'api-key': provider.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return this.parseAIResponse(content);
  }

  private parseAIResponse(content: string): AIResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          data: parsed.data || {},
          insights: parsed.insights || [],
          visualizations: parsed.visualizations || [],
          summary: parsed.summary || '',
          recommendations: parsed.recommendations || []
        };
      }
      
      // Fallback to text parsing
      return {
        data: {},
        insights: [content],
        visualizations: [],
        summary: content,
        recommendations: []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        data: {},
        insights: [content],
        visualizations: [],
        summary: content,
        recommendations: []
      };
    }
  }

  getProvider(providerId: string): AIProvider | undefined {
    return this.providers.get(providerId);
  }

  getActiveProvider(): AIProvider | undefined {
    return Array.from(this.providers.values()).find(provider => provider.isActive);
  }

  getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  updateProvider(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }
}
