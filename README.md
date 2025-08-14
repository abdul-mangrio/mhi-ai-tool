# NetSuite AI Assistant

A sophisticated React.js web application that serves as an intelligent AI assistant for NetSuite ERP operations. The application accepts natural language queries and leverages AI APIs (OpenAI, Claude, etc.) to process requests and return formatted NetSuite data with intelligent insights.

## 🚀 Features

### Core Capabilities
- **Natural Language Processing**: Intelligent chat interface with message history
- **Multi-AI Provider Support**: OpenAI GPT-4, Claude 3, Google Gemini, Azure OpenAI
- **NetSuite Integration**: Comprehensive ERP data access and analysis
- **Real-time Data Visualization**: Interactive charts, tables, and KPI dashboards
- **Voice Input**: Speech-to-text capability using Web Speech API
- **Multi-language Support**: English, Spanish, French, German
- **Export Functionality**: Chat conversations to PDF/Word

### NetSuite Modules Supported
- **Financial Management**: GL, AP, AR, Financial Reporting
- **Customer Relationship Management**: Leads, Contacts, Opportunities
- **Sales Order Management**: Quotes, Orders, Fulfillment
- **Purchase Management**: PO, Receipts, Vendor Management
- **Inventory Management**: Items, Locations, Adjustments
- **Project Management**: Projects, Tasks, Time Tracking
- **Human Resources**: Employees, Payroll, Benefits
- **Analytics & Reporting**: Dashboards, KPIs, Custom Reports

### Sample Queries
- "Show me the cash flow for Q3 2024"
- "What's our accounts receivable aging report?"
- "Who are our top 10 customers by revenue this year?"
- "Which items are below reorder point?"
- "Generate a sales performance report by territory"
- "Show me revenue trend analysis for the past 6 months"

## 🛠️ Technology Stack

- **Frontend**: React.js 18+ with TypeScript
- **UI Framework**: Material-UI (MUI) with custom theme
- **State Management**: React Context + useReducer
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **AI Integration**: OpenAI, Claude, Gemini APIs

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- NetSuite account with API access
- AI provider API keys (OpenAI, Claude, etc.)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netsuite-ai-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # AI Provider API Keys
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   REACT_APP_CLAUDE_API_KEY=your_claude_api_key
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   REACT_APP_AZURE_OPENAI_API_KEY=your_azure_api_key

   # NetSuite Configuration
   REACT_APP_NETSUITE_ACCOUNT_ID=your_netsuite_account_id
   REACT_APP_NETSUITE_CONSUMER_KEY=your_consumer_key
   REACT_APP_NETSUITE_CONSUMER_SECRET=your_consumer_secret
   REACT_APP_NETSUITE_TOKEN_ID=your_token_id
   REACT_APP_NETSUITE_TOKEN_SECRET=your_token_secret
   REACT_APP_NETSUITE_BASE_URL=https://your-account.netsuite.com
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx
│   ├── MessageBubble.tsx
│   ├── DataVisualization.tsx
│   ├── QuickActions.tsx
│   ├── Navigation.tsx
│   ├── Dashboard.tsx
│   └── Settings.tsx
├── contexts/           # React contexts
│   └── AppContext.tsx
├── services/           # Business logic services
│   ├── aiAssistant.ts
│   ├── aiService.ts
│   ├── netsuiteService.ts
│   └── queryProcessor.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🔧 Configuration

### AI Provider Setup

1. **OpenAI**
   - Get API key from [OpenAI Platform](https://platform.openai.com/)
   - Set `REACT_APP_OPENAI_API_KEY` in environment variables

2. **Claude (Anthropic)**
   - Get API key from [Anthropic Console](https://console.anthropic.com/)
   - Set `REACT_APP_CLAUDE_API_KEY` in environment variables

3. **Google Gemini**
   - Get API key from [Google AI Studio](https://makersuite.google.com/)
   - Set `REACT_APP_GEMINI_API_KEY` in environment variables

### NetSuite Integration

1. **Create Integration Record**
   - Log into NetSuite
   - Go to Setup > Integration > Manage Integrations
   - Create new integration record
   - Note down Consumer Key and Consumer Secret

2. **Generate Access Token**
   - Go to Setup > Users/Roles > Access Tokens
   - Create new access token
   - Note down Token ID and Token Secret

3. **Configure Environment Variables**
   - Set all NetSuite-related environment variables
   - Ensure proper permissions are assigned to the integration

## 🚀 Usage

### Basic Usage

1. **Start a Conversation**
   - Type your query in natural language
   - Use voice input by clicking the microphone icon
   - Try quick action buttons for common queries

2. **View Results**
   - AI responses include insights and recommendations
   - Data visualizations are automatically generated
   - Export conversations for reporting

3. **Navigate Features**
   - Use the sidebar to switch between AI Assistant, Dashboard, and Settings
   - Configure AI providers and NetSuite connection in Settings

### Advanced Features

1. **Custom Queries**
   - Ask complex financial questions
   - Request trend analysis
   - Generate custom reports

2. **Data Export**
   - Export chat conversations
   - Download data visualizations
   - Generate PDF reports

3. **Multi-language Support**
   - Switch between languages in Settings
   - Voice input supports multiple languages

## 🔒 Security

- API keys are stored in environment variables
- OAuth 2.0 integration with NetSuite
- JWT token management
- Role-based access control (RBAC)
- Data encryption in transit and at rest

## 📊 Performance

- **Response Time**: < 3 seconds for most queries
- **Uptime**: 99.9% target
- **Scalability**: Auto-scaling based on usage
- **Caching**: Redis caching layer for frequently accessed data

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run integration tests
npm run test:integration
```

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t netsuite-ai-assistant .

# Run container
docker run -p 3000:3000 netsuite-ai-assistant
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment:
- AI provider API keys
- NetSuite credentials
- Database connection strings
- Redis configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Roadmap

### Phase 1 (Months 1-2)
- ✅ Core chat interface
- ✅ Basic NetSuite integration
- ✅ AI provider integration

### Phase 2 (Months 3-4)
- 🔄 Advanced AI processing
- 🔄 Enhanced data visualization
- 🔄 Machine learning features

### Phase 3 (Months 5-6)
- 📋 Mobile optimization
- 📋 Enterprise features
- 📋 Advanced analytics

### Phase 4 (Months 7-8)
- 📋 Security hardening
- 📋 Performance optimization
- 📋 Production deployment

## 📈 Metrics & KPIs

- **Query Response Time**: Target < 3 seconds
- **User Satisfaction**: Target > 4.5/5
- **Query Accuracy**: Target > 95%
- **System Uptime**: Target 99.9%
- **Cost per Query**: Optimized across AI providers

---

**Built with ❤️ for intelligent ERP operations**
