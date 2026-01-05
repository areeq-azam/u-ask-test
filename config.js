/**
 * Configuration file for u-ask test automation
 */

// OpenAI API Key - Place your API key here
const OPENAI_API_KEY = '';

module.exports = {
  // Base URL for the u-ask website
  baseUrl: 'https://ask.u.ae/en/uask',
  
  // Browser configurations
  browsers: {
    chromium: {
      name: 'Chromium',
      headless: true
    },
    firefox: {
      name: 'Firefox',
      headless: true
    },
    webkit: {
      name: 'WebKit',
      headless: true
    }
  },
  
  // Timeout settings (in milliseconds)
  timeouts: {
    navigation: 30000,
    action: 10000
  },
  
  // Viewport settings
  viewport: {
    width: 1920,
    height: 1080
  },
  
  // LLM Validation Configuration
  llmValidation: {
    enabled: true,
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: OPENAI_API_KEY,
    timeout: 30000,
    temperature: 0.3, // Lower temperature for consistent evaluation
    thresholds: {
      relevance: 0.7,
      accuracy: 0.7,
      consistency: 0.8,
      overall: 0.75
    }
  }
};

