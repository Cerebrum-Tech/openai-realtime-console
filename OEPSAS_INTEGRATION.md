# OEPSAS Integration for OpenAI Realtime Console

## Overview
This project has been modified to integrate with the OEPSAS API for Zorlu Enerji customer service operations. The OpenAI Realtime Console now functions as a voice-enabled customer service assistant for electricity subscription management.

## What's Changed

### 1. **New Files Added**
- `oepsasApi.js` - JavaScript module containing all OEPSAS API functions for subscription and ticket management
- `toolsConfig.js` - Configuration file with system instructions and tool definitions for the AI assistant

### 2. **Modified Files**
- `package.json` - Added axios dependency for HTTP requests
- `server.js` - Added JSON middleware support
- `client/components/ToolPanel.jsx` - Updated to handle OEPSAS API function calls and display results

### 3. **Features Implemented**

#### Subscription Management (Abone Bilgileri)
- Create new subscriptions
- Query subscriptions by TC ID, phone, or subscription number
- Update subscriber information
- Delete subscriptions
- Update subscription status and balance
- Advanced search capabilities

#### Ticket System
- Create support tickets and fault reports
- Query tickets by various parameters
- Update ticket status and priority
- Search tickets by date, status, type, and location

## System Capabilities

The AI assistant can now help with:
- **Subscription Termination** - Complete flow with identity verification
- **New Subscription Applications** - Document verification and eligibility check
- **Information Updates** - Address, phone, email changes
- **Fault Reporting** - Create and track support tickets
- **Special Cases** - Handling deceased subscribers, construction sites, commercial entities

## How to Use

1. **Setup Environment Variables**
   Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

5. **Start a Session**
   - Click "Start Session" to begin
   - Allow microphone access when prompted
   - The AI assistant will be ready to help with Zorlu Enerji services

## API Integration Details

### Base URL
The OEPSAS API base URL is configured as: `https://oepsas.unicevap.com`

### Error Handling
- API errors are translated from English to Turkish for better user experience
- Validation errors are properly displayed to users
- Connection failures trigger fallback responses

### Authentication Flow
The system follows strict authentication procedures:
1. Subscriber ownership verification
2. Identity confirmation with TC ID
3. Contract number validation
4. Multi-factor verification for sensitive operations

## Voice Interaction

The system uses OpenAI's Realtime API for voice interactions:
- Real-time speech recognition
- Natural language understanding
- Context-aware responses
- Function calling for API operations

## Security Considerations

- Never stores sensitive information locally
- All API calls are made server-side
- Identity verification required for all operations
- Special handling for deceased subscribers and legal entities

## Testing

To test the integration:
1. Start a voice session
2. Say "Aboneliğimi sonlandırmak istiyorum" (I want to terminate my subscription)
3. Follow the assistant's prompts for verification
4. The system will guide you through the complete process

## Important Notes

- The assistant strictly follows Zorlu Enerji/OEPSAŞ procedures
- Certain operations require live support handoff
- Special account number 1061231233 triggers technical error for testing
- Deposit refunds follow specific calculation formulas

## Support

For issues or questions about the integration:
- Check the console logs for API call details
- Review the `oepsasApi.js` file for available functions
- Refer to `toolsConfig.js` for system behavior configuration