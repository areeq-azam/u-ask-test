const { test, expect } = require('@playwright/test');
const UAskPage = require('../pages/UAskPage');
const LLMValidator = require('../utils/LLMValidator');
const testData = require('../testdata.json');
const config = require('../config');

test.describe('AI-Powered Response Validation', () => {
  let uAskPage;
  let llmValidator;

  test.beforeEach(async ({ page }) => {
    uAskPage = new UAskPage(page);
    
    // Initialize LLM validator if API key is configured
    if (config.llmValidation.enabled) {
      try {
        llmValidator = new LLMValidator(config);
      } catch (error) {
        console.warn('LLM Validation disabled:', error.message);
        llmValidator = null;
      }
    }
    
    await uAskPage.navigate();
    await uAskPage.clickAcceptButton();
    await uAskPage.wait(1000);
  });

  test('TC11: Validate Response Quality - Visa Application', async () => {
    const tcData = testData.testCases.TC11;
    const generalizedInstructions = testData.generalizedInstructions;
    
    let enResponse = '';
    let arResponse = '';

    // Test English response
    if (tcData.language === 'both' || tcData.language === 'en') {
      await uAskPage.sendMessage(tcData.inputs.en);
      await uAskPage.waitForAIResponse(45000);
      enResponse = await uAskPage.getLastAIResponse();
      
      expect(enResponse.length).toBeGreaterThan(0);
      
      if (llmValidator && enResponse.length > 0) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.en,
          enResponse,
          'en'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Test Arabic response
    if (tcData.language === 'both' || tcData.language === 'ar') {
      await uAskPage.clickLanguageSwitcher();
      await uAskPage.wait(2000);
      
      await uAskPage.sendMessage(tcData.inputs.ar);
      await uAskPage.waitForAIResponse(60000);
      arResponse = await uAskPage.getLastAIResponse();
      
      expect(arResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.ar,
          arResponse,
          'ar'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Check if responses are consistent across languages
    if (tcData.language === 'both' && enResponse && arResponse && llmValidator) {
      const consistency = await llmValidator.checkConsistency(
        generalizedInstructions,
        tcData,
        enResponse,
        arResponse,
        tcData.inputs.en,
        tcData.inputs.ar
      );
      
      expect(consistency.consistent).toBe(true);
      expect(consistency.score).toBeGreaterThanOrEqual(config.llmValidation.thresholds.consistency);
    }
  }, 180000);

  test('TC12: Validate Response Quality - Driving License', async () => {
    const tcData = testData.testCases.TC12;
    const generalizedInstructions = testData.generalizedInstructions;
    
    let enResponse = '';
    let arResponse = '';

    if (tcData.language === 'both' || tcData.language === 'en') {
      await uAskPage.sendMessage(tcData.inputs.en);
      await uAskPage.waitForAIResponse(45000);
      enResponse = await uAskPage.getLastAIResponse();
      
      expect(enResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.en,
          enResponse,
          'en'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Test Arabic response
    if (tcData.language === 'both' || tcData.language === 'ar') {
      await uAskPage.clickLanguageSwitcher();
      await uAskPage.wait(2000);
      
      await uAskPage.sendMessage(tcData.inputs.ar);
      await uAskPage.waitForAIResponse(60000);
      arResponse = await uAskPage.getLastAIResponse();
      
      expect(arResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.ar,
          arResponse,
          'ar'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Check if responses are consistent across languages
    if (tcData.language === 'both' && enResponse && arResponse && llmValidator) {
      const consistency = await llmValidator.checkConsistency(
        generalizedInstructions,
        tcData,
        enResponse,
        arResponse,
        tcData.inputs.en,
        tcData.inputs.ar
      );
      
      expect(consistency.consistent).toBe(true);
      expect(consistency.score).toBeGreaterThanOrEqual(config.llmValidation.thresholds.consistency);
    }
  }, 180000);

  test('TC13: Validate Response Quality - Golden Visa', async () => {
    const tcData = testData.testCases.TC13;
    const generalizedInstructions = testData.generalizedInstructions;
    
    let enResponse = '';
    let arResponse = '';

    if (tcData.language === 'both' || tcData.language === 'en') {
      await uAskPage.sendMessage(tcData.inputs.en);
      await uAskPage.waitForAIResponse(45000);
      enResponse = await uAskPage.getLastAIResponse();
      
      expect(enResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.en,
          enResponse,
          'en'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Test Arabic response
    if (tcData.language === 'both' || tcData.language === 'ar') {
      await uAskPage.clickLanguageSwitcher();
      await uAskPage.wait(2000);
      
      await uAskPage.sendMessage(tcData.inputs.ar);
      await uAskPage.waitForAIResponse(60000);
      arResponse = await uAskPage.getLastAIResponse();
      
      expect(arResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.ar,
          arResponse,
          'ar'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Check if responses are consistent across languages
    if (tcData.language === 'both' && enResponse && arResponse && llmValidator) {
      const consistency = await llmValidator.checkConsistency(
        generalizedInstructions,
        tcData,
        enResponse,
        arResponse,
        tcData.inputs.en,
        tcData.inputs.ar
      );
      
      expect(consistency.consistent).toBe(true);
      expect(consistency.score).toBeGreaterThanOrEqual(config.llmValidation.thresholds.consistency);
    }
  }, 180000);

  test('TC14: Validate Response Quality - Family Sponsorship Visa', async () => {
    const tcData = testData.testCases.TC14;
    const generalizedInstructions = testData.generalizedInstructions;
    
    let enResponse = '';
    let arResponse = '';

    if (tcData.language === 'both' || tcData.language === 'en') {
      await uAskPage.sendMessage(tcData.inputs.en);
      await uAskPage.waitForAIResponse(45000);
      enResponse = await uAskPage.getLastAIResponse();
      
      expect(enResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.en,
          enResponse,
          'en'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Test Arabic response
    if (tcData.language === 'both' || tcData.language === 'ar') {
      await uAskPage.clickLanguageSwitcher();
      await uAskPage.wait(2000);
      
      await uAskPage.sendMessage(tcData.inputs.ar);
      await uAskPage.waitForAIResponse(60000);
      arResponse = await uAskPage.getLastAIResponse();
      
      expect(arResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.ar,
          arResponse,
          'ar'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Check if responses are consistent across languages
    if (tcData.language === 'both' && enResponse && arResponse && llmValidator) {
      const consistency = await llmValidator.checkConsistency(
        generalizedInstructions,
        tcData,
        enResponse,
        arResponse,
        tcData.inputs.en,
        tcData.inputs.ar
      );
      
      expect(consistency.consistent).toBe(true);
      expect(consistency.score).toBeGreaterThanOrEqual(config.llmValidation.thresholds.consistency);
    }
  }, 180000);

  test('TC15: Validate Response Quality - General Public Services', async () => {
    const tcData = testData.testCases.TC15;
    const generalizedInstructions = testData.generalizedInstructions;
    
    let enResponse = '';
    let arResponse = '';

    if (tcData.language === 'both' || tcData.language === 'en') {
      await uAskPage.sendMessage(tcData.inputs.en);
      await uAskPage.waitForAIResponse(45000);
      enResponse = await uAskPage.getLastAIResponse();
      
      expect(enResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.en,
          enResponse,
          'en'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Test Arabic response
    if (tcData.language === 'both' || tcData.language === 'ar') {
      await uAskPage.clickLanguageSwitcher();
      await uAskPage.wait(2000);
      
      await uAskPage.sendMessage(tcData.inputs.ar);
      await uAskPage.waitForAIResponse(60000);
      arResponse = await uAskPage.getLastAIResponse();
      
      expect(arResponse.length).toBeGreaterThan(0);
      
      if (llmValidator) {
        const validation = await llmValidator.validateResponse(
          generalizedInstructions,
          tcData,
          tcData.inputs.ar,
          arResponse,
          'ar'
        );
        
        expect(validation.pass).toBe(true);
        expect(validation.overall).toBeGreaterThanOrEqual(config.llmValidation.thresholds.overall);
        expect(validation.hallucination).toBe(false);
      }
    }

    // Check if responses are consistent across languages
    if (tcData.language === 'both' && enResponse && arResponse && llmValidator) {
      const consistency = await llmValidator.checkConsistency(
        generalizedInstructions,
        tcData,
        enResponse,
        arResponse,
        tcData.inputs.en,
        tcData.inputs.ar
      );
      
      expect(consistency.consistent).toBe(true);
      expect(consistency.score).toBeGreaterThanOrEqual(config.llmValidation.thresholds.consistency);
    }
  }, 180000);
});

