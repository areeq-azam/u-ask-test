const OpenAI = require('openai');

/**
 * LLM Validator for AI Response Validation
 * Uses OpenAI GPT to validate chatbot responses against expected behavior
 */
class LLMValidator {
  constructor(config) {
    this.config = config.llmValidation;
    const apiKey = this.config.apiKey?.trim();
    if (!apiKey || apiKey === '') {
      throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY variable in config.js');
    }
    this.openai = new OpenAI({ apiKey: apiKey });
  }

  /**
   * Build validation prompt using:
   * - Generalized instructions from testdata.json
   * - Test case expected behavior
   * - User input and AI response
   */
  buildValidationPrompt(generalizedInstructions, testCaseData, userInput, aiResponse, language) {
    const instructions = generalizedInstructions.join('\n');
    const expectedBehavior = testCaseData.expectedBehavior[language];

    return `You are a quality assurance validator for a UAE government AI chatbot.

GENERAL VALIDATION CRITERIA (apply to all responses):
${instructions}

TEST CASE: ${testCaseData.description}
EXPECTED BEHAVIOR (${language.toUpperCase()}):
${expectedBehavior}

USER INPUT (${language.toUpperCase()}):
${userInput}

AI RESPONSE:
${aiResponse}

Evaluate the AI response based on the general criteria and expected behavior. Return ONLY a valid JSON object with no additional text:
{
  "pass": true or false,
  "relevance": 0.0 to 1.0,
  "accuracy": 0.0 to 1.0,
  "hallucination": true or false,
  "formatting": 0.0 to 1.0,
  "overall": 0.0 to 1.0,
  "reason": "brief explanation of the evaluation"
}`;
  }

  /**
   * Validate response using OpenAI
   */
  async validateResponse(generalizedInstructions, testCaseData, userInput, aiResponse, language) {
    try {
      const prompt = this.buildValidationPrompt(
        generalizedInstructions,
        testCaseData,
        userInput,
        aiResponse,
        language
      );

      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a quality assurance validator. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0].message.content;
      const validation = JSON.parse(responseText);

      return {
        pass: validation.pass,
        relevance: validation.relevance || 0,
        accuracy: validation.accuracy || 0,
        hallucination: validation.hallucination || false,
        formatting: validation.formatting || 0,
        overall: validation.overall || 0,
        reason: validation.reason || 'No reason provided',
        raw: validation
      };
    } catch (error) {
      console.error('LLM Validation Error:', error.message);
      return {
        pass: false,
        relevance: 0,
        accuracy: 0,
        hallucination: true,
        formatting: 0,
        overall: 0,
        reason: `Validation failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Check consistency between English and Arabic responses
   */
  async checkConsistency(generalizedInstructions, testCaseData, enResponse, arResponse, enInput, arInput) {
    try {
      const instructions = generalizedInstructions.join('\n');
      const expectedBehaviorEn = testCaseData.expectedBehavior.en;
      const expectedBehaviorAr = testCaseData.expectedBehavior.ar;

      const prompt = `You are a quality assurance validator for a UAE government AI chatbot.

GENERAL VALIDATION CRITERIA:
${instructions}

TEST CASE: ${testCaseData.description}

EXPECTED BEHAVIOR (ENGLISH):
${expectedBehaviorEn}

EXPECTED BEHAVIOR (ARABIC):
${expectedBehaviorAr}

ENGLISH INPUT: ${enInput}
ENGLISH RESPONSE: ${enResponse}

ARABIC INPUT: ${arInput}
ARABIC RESPONSE: ${arResponse}

Evaluate if both responses are consistent in meaning and intent, even though they are in different languages. Return ONLY a valid JSON object:
{
  "consistent": true or false,
  "score": 0.0 to 1.0,
  "reason": "brief explanation"
}`;

      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a quality assurance validator. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0].message.content;
      const consistency = JSON.parse(responseText);

      return {
        consistent: consistency.consistent || false,
        score: consistency.score || 0,
        reason: consistency.reason || 'No reason provided'
      };
    } catch (error) {
      console.error('Consistency Check Error:', error.message);
      return {
        consistent: false,
        score: 0,
        reason: `Consistency check failed: ${error.message}`,
        error: error.message
      };
    }
  }
}

module.exports = LLMValidator;

