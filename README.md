# 🤖 U-Ask Test Automation

A Playwright-based automation project for testing the [u-ask website](https://ask.u.ae/en/uask) across different browsers.

## 📋 Overview

This project provides a comprehensive Playwright test automation framework with cross-browser support for the u-ask website. It includes UI testing, chatbot functionality validation, and AI-powered response quality assessment using LLM validation.

## ⚠️ Disclaimer

- During the initial screening call, a test environment was requested but was not provided
- When asked again, it was communicated that any u-ask environment could be used
- Only production and beta environments were available on the internet which was found upon exploration
- Both environments have captcha/reCAPTCHA installed, which cannot be handled via automation strategies
- Some tests may fail solely due to reCAPTCHA restrictions

## 🚀 Getting Started

### 📦 Prerequisites

- ✅ Node.js (v20.0.0 or higher)
- ✅ npm or yarn package manager

### 💻 Installation

Install dependencies and Playwright browsers (all in one command):
```bash
npm install
```

The `postinstall` script will automatically install all Playwright browsers after dependencies are installed.

### 🔑 Configure OpenAI API Key

- Open `config.js` and set the `OPENAI_API_KEY` variable with your OpenAI API key
- This is required for running AI validation test cases (`ai-validation-chatbot.test.js`)
- The API key is used by the LLM validator to evaluate chatbot responses

## 📁 Project Structure

```
u-ask-test/
├── config.js                      # ⚙️ Configuration file (URL, settings, and API keys)
├── package.json                   # 📦 Project dependencies and scripts
├── playwright.config.js           # 🎭 Playwright test configuration
├── pages/
│   └── UAskPage.js                # 📄 Page Object Model (POM) for U-Ask page
├── tests/
│   ├── uask.test.js               # ✅ Basic UI test cases
│   ├── chatbot.test.js            # 💬 Chatbot functionality test cases
│   └── ai-validation-chatbot.test.js  # 🤖 AI response validation test cases
├── utils/
│   └── LLMValidator.js            # 🔍 LLM-powered response validator
├── testdata.json                  # 📊 Test data for AI validation cases
└── README.md                      # 📖 This file
```

### 🏗️ Architecture Overview

**📐 Page Object Model (POM):**
This project follows the Page Object Model design pattern. All page locators and interaction methods are centralized in `pages/UAskPage.js`. This approach provides:
- 🔧 **Maintainability**: Locator changes only need to be updated in one place
- ♻️ **Reusability**: Common actions can be reused across multiple test files
- 📖 **Readability**: Tests are cleaner and focus on test logic rather than implementation details

The `UAskPage.js` class contains:
- 🎯 Selectors for all UI elements (buttons, inputs, messages, etc.)
- 🔄 Methods for interacting with the page (navigation, clicking, typing, retrieving text)
- ✔️ Helper methods for validation (checking visibility, text direction, input state)

**🧪 Test Suites:**
All test cases are organized in the `tests/` folder with three distinct test suites:

1. **`uask.test.js`** 📱 - Basic UI validation tests covering fundamental page elements and functionality
2. **`chatbot.test.js`** 💬 - Comprehensive chatbot functionality tests including message sending, response retrieval, language switching, and UI interactions
3. **`ai-validation-chatbot.test.js`** 🤖 - AI response quality validation using LLM as a judge (requires OpenAI API key)

### 📄 Key Files Description

**⚙️ `config.js`:**
Central configuration file containing:
- 🌐 Base URL for the application
- 🌍 Browser configurations (Chromium, Firefox, WebKit)
- ⏱️ Timeout settings (navigation and action timeouts)
- 📐 Viewport dimensions
- 🤖 LLM validation settings (model, API key, thresholds, temperature)
- 🔑 OpenAI API key variable (`OPENAI_API_KEY`)

**🎭 `playwright.config.js`:**
Playwright framework configuration including:
- 📁 Test directory location (`./tests`)
- 📊 Reporter settings (HTML reporter)
- 🌍 Browser projects (Chromium, Firefox, WebKit)
- ⚙️ Global settings (timeouts, viewport, locale, timezone)
- 📸 Screenshot and video capture settings (on failure)
- 🔍 Trace configuration for debugging

**🔍 `utils/LLMValidator.js`:**
Utility class that performs AI response validation using OpenAI's GPT models. It:
- 📥 Takes chatbot responses and evaluates them against expected behavior
- 📋 Uses generalized validation criteria and test-case-specific requirements
- 📊 Returns structured validation results (pass/fail, relevance score, accuracy score, hallucination detection)
- 🌐 Checks consistency between English and Arabic responses
- ⚙️ Configurable via `config.js` (model, temperature, thresholds)

**📊 `testdata.json`:**
JSON file containing:
- 🧪 Test case definitions (TC11, TC12, TC13, TC14, TC15)
- 💬 Input messages in English and Arabic for each test case
- 📝 Expected behavior descriptions for validation
- 📋 Generalized instructions that apply to all AI validation tests

## 🎯 Usage

### 🚀 Essential Commands

**▶️ Run all tests (headless, parallel):**
```bash
npm test
```

**🌍 Run tests on a specific browser:**
```bash
npm run test:chromium    # Chromium/Chrome
npm run test:firefox     # Firefox
npm run test:webkit      # Safari
```

**📦 Run a specific test suite:**
```bash
npm run test:chatbot                    # Chatbot functionality tests
npm run test:ai-validation              # AI response validation tests
```

**👁️ Run tests in headed mode (visible browser):**
```bash
npm run test:headed
```

**⏳ Run tests sequentially (one at a time):**
```bash
npm run test:sequential
```

**📊 View test report:**
```bash
npm run report
```

**🐛 Debug tests:**
```bash
npm run test:debug
```

### 📚 Further Scripts

| Script | Description |
|--------|-------------|
| `npm run test:all` | Run tests on all browsers (Chromium, Firefox, WebKit) |
| `npm run test:headless` | Run tests in headless mode (default behavior) |
| `npm run test:parallel` | Run tests in parallel (default behavior) |
| `npm run test:chatbot:headed` | Run chatbot tests in headed mode |
| `npm run test:chatbot:sequential` | Run chatbot tests sequentially |
| `npm run test:ai-validation:headed` | Run AI validation tests in headed mode |
| `npm run test:ai-validation:sequential` | Run AI validation tests sequentially |

### 🔗 Combining Options

You can also combine Playwright options directly for advanced scenarios:
```bash
# Run specific test file in headed mode, sequentially
playwright test tests/chatbot.test.js --headed --workers=1

# Run specific test case by name
playwright test -g "TC01"

# Run on specific browser with custom workers
playwright test --project=chromium --workers=2
```

## ⚙️ Configuration

The URL and browser settings are stored in `config.js`. This file contains all configuration including base URL, browser settings, timeouts, viewport, and LLM validation parameters. To modify any settings, edit the `config.js` file.

### 🤖 AI Validation Tests

The AI validation test suite (`ai-validation-chatbot.test.js`) uses an LLM (Large Language Model) as a judge to evaluate chatbot response quality. Here's how it works:

For each test case, the system:
1. 📤 Sends a user query to the chatbot (in English and/or Arabic)
2. 📥 Retrieves the AI's response from the conversation
3. 🔍 Sends both the user input and AI response to OpenAI's GPT model along with:
   - 📋 Generalized validation criteria (applies to all responses)
   - 🎯 Expected behavior specific to the test case
4. ✅ The LLM evaluates the response and returns:
   - ✅/❌ Pass/fail status
   - 📊 Relevance score (0.0 to 1.0)
   - 🎯 Accuracy score (0.0 to 1.0)
   - 🚫 Hallucination detection (true/false)
   - 📝 Formatting quality score
   - ⭐ Overall quality score
   - 💭 Reasoning for the evaluation

This approach allows automated validation of AI responses without manual review, checking for relevance, accuracy, and consistency across languages. The validation thresholds and model settings can be configured in `config.js`.

**📊 Test Data:**
Test cases and their expected behaviors are defined in `testdata.json`. Each test case includes input messages in both languages and expected behavior descriptions that guide the LLM validator's evaluation.

## 🌐 Cross-Browser Testing

The project supports testing across three major browser engines:

- 🌐 **Chromium** - Google Chrome, Microsoft Edge
- 🦊 **Firefox** - Mozilla Firefox
- 🍎 **WebKit** - Safari

All browsers can be tested individually or together using the provided npm scripts.

## 📊 Viewing Test Reports

After running tests, Playwright generates an HTML report with detailed test results, screenshots, and videos.

### 🚀 Method 1: Using npm Script (Recommended)
```bash
npm run report
```
This command automatically opens the HTML report in your default browser.

### 🔄 Alternative: Using Playwright Command
```bash
npx playwright show-report
```

### 📂 Method 2: Open Report Manually
1. Navigate to the `playwright-report` directory
2. Open `index.html` in your web browser

### 📋 Report Contents
The HTML report includes:
- ✅ **Test Results**: Pass/fail status for each test case
- 📸 **Screenshots**: Automatic screenshots for failed tests
- 🎥 **Videos**: Video recordings of test execution (for failed tests)
- 📝 **Error Details**: Stack traces and error messages
- ⏱️ **Execution Time**: Duration for each test
- 🌐 **Browser Info**: Which browser was used for each test

### 📁 Report Location
- 📂 **Report Directory**: `playwright-report/`
- 📦 **Test Artifacts**: `test-results/` (screenshots, videos, error context)
