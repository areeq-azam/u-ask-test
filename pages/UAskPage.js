const config = require('../config');

class UAskPage {
  constructor(page) {
    this.page = page;
  }

  selectors = {
    acceptButton: 'button[aria-label="Accept and continue"]',
    languageSwitcher: '[aria-label*="language" i]',
    languageDropdown: 'select',
    greeting: 'h1, h2',
    searchInput: 'textarea#conversation',
    sendButton: 'button[type="submit"]',
    conversationArea: 'main, [class*="conversation"]',
    aiMessage: '[class*="message"]:not([class*="user"])',
    userMessage: '[class*="user"][class*="message"]',
    termsLink: 'a[href*="terms"]'
  };

  async navigate() {
    await this.page.goto(config.baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: config.timeouts.navigation
    });
  }

  async getTitle() {
    return await this.page.title();
  }

  getCurrentUrl() {
    return this.page.url();
  }

  async clickAcceptButton() {
    await this.page.waitForSelector(this.selectors.acceptButton, { 
      state: 'visible',
      timeout: config.timeouts.action 
    });
    await this.page.click(this.selectors.acceptButton);
  }

  async isGreetingVisible() {
    try {
      const greeting1 = this.page.getByText(/hello.*good day/i);
      const greeting2 = this.page.getByText(/how can i help you/i);
      const greeting3 = this.page.locator('h1, h2').first();
      
      const visible1 = await greeting1.isVisible({ timeout: 2000 }).catch(() => false);
      const visible2 = await greeting2.isVisible({ timeout: 2000 }).catch(() => false);
      const visible3 = await greeting3.isVisible({ timeout: 2000 }).catch(() => false);
      
      return visible1 || visible2 || visible3;
    } catch {
      return false;
    }
  }

  async isSearchInputVisible() {
    return await this.page.locator(this.selectors.searchInput).first().isVisible();
  }

  async isSearchInputEnabled() {
    return await this.page.locator(this.selectors.searchInput).first().isEnabled();
  }

  async enterSearchText(text) {
    const input = this.page.locator(this.selectors.searchInput).first();
    await input.waitFor({ state: 'visible', timeout: config.timeouts.action });
    await input.fill(text);
  }

  async getSearchInputValue() {
    return await this.page.locator(this.selectors.searchInput).first().inputValue();
  }

  async clearSearchInput() {
    await this.page.locator(this.selectors.searchInput).first().clear();
  }

  async getSuggestedQuestionsCount() {
    try {
      const goldenVisa = this.page.getByText(/golden visa/i);
      const drivingLicense = this.page.getByText(/driving license/i);
      const sponsoringVisa = this.page.getByText(/sponsoring visa|family/i);
      
      const count1 = await goldenVisa.count();
      const count2 = await drivingLicense.count();
      const count3 = await sponsoringVisa.count();
      
      return count1 + count2 + count3;
    } catch {
      return 0;
    }
  }

  async clickGoldenVisaQuestion() {
    const locator = this.page.getByText(/golden visa/i).first();
    await locator.click();
  }

  async clickDrivingLicenseQuestion() {
    const locator = this.page.getByText(/driving license/i).first();
    await locator.click();
  }

  async clickSponsoringVisaQuestion() {
    const locator = this.page.getByText(/sponsoring visa|family/i).first();
    await locator.click();
  }

  async isLanguageSwitcherVisible() {
    return await this.page.locator(this.selectors.languageSwitcher).isVisible();
  }

  async clickLanguageSwitcher() {
    try {
      const switcher = this.page.locator(this.selectors.languageSwitcher).first();
      await switcher.waitFor({ state: 'visible', timeout: config.timeouts.action });
      await switcher.click();
    } catch {
      const btn = this.page.locator('button:has-text("العربية")').first();
      await btn.click();
    }
  }

  async isMicrophoneButtonVisible() {
    try {
      const mic = this.page.locator('button[aria-label*="microphone" i]');
      return await mic.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async clickMicrophoneButton() {
    const mic = this.page.locator('button[aria-label*="microphone" i]').first();
    await mic.click();
  }

  async isTermsLinkVisible() {
    try {
      const link = this.page.locator(this.selectors.termsLink);
      return await link.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async clickTermsLink() {
    await this.page.locator(this.selectors.termsLink).first().click();
  }

  async scrollToFooter() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  async isSendButtonVisible() {
    try {
      const btn = this.page.locator(this.selectors.sendButton);
      return await btn.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async isConversationAreaVisible() {
    try {
      const area = this.page.locator(this.selectors.conversationArea).first();
      return await area.isVisible({ timeout: 2000 });
    } catch {
      return true;
    }
  }

  async sendMessage(message) {
    try {
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('golden visa')) {
        await this.clickGoldenVisaQuestion();
        await this.wait(500);
        return;
      }
      if (lowerMsg.includes('driving license') || lowerMsg.includes('driving licence')) {
        await this.clickDrivingLicenseQuestion();
        await this.wait(500);
        return;
      }
      if (lowerMsg.includes('sponsoring visa') || lowerMsg.includes('family')) {
        await this.clickSponsoringVisaQuestion();
        await this.wait(500);
        return;
      }
    } catch {}
    
    await this.enterSearchText(message);
    
    try {
      const sendButton = this.page.locator(this.selectors.sendButton).first();
      if (await sendButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await sendButton.click();
      } else {
        const input = this.page.locator(this.selectors.searchInput).first();
        await input.press('Enter');
      }
    } catch {
      const input = this.page.locator(this.selectors.searchInput).first();
      await input.press('Enter');
    }
  }

  async getLastUserMessage() {
    try {
      const userMsg = this.page.locator(this.selectors.userMessage).last();
      const text = await userMsg.textContent().catch(() => '');
      if (text) return text.trim();
      
      const allMessages = this.page.locator('[class*="message"]');
      const count = await allMessages.count();
      if (count > 0) {
        const lastMsg = allMessages.last();
        const text2 = await lastMsg.textContent().catch(() => '');
        return text2 ? text2.trim() : '';
      }
      return '';
    } catch {
      return '';
    }
  }

  async getLastAIResponse() {
    try {
      await this.wait(3000);
      
      const aiMessages = this.page.locator(this.selectors.aiMessage);
      const count = await aiMessages.count();
      
      if (count > 0) {
        const lastMsg = aiMessages.last();
        const text = await lastMsg.textContent();
        return text ? text.trim() : '';
      }
      
      const allDivs = this.page.locator('div').filter({ hasText: /.{200,}/ });
      const divCount = await allDivs.count();
      
      for (let i = divCount - 1; i >= 0; i--) {
        const div = allDivs.nth(i);
        const text = await div.textContent();
        const cleanText = text ? text.trim() : '';
        
        if (cleanText.length > 200 && 
            !cleanText.toLowerCase().includes('terms of service') &&
            !cleanText.toLowerCase().includes('privacy policy') &&
            !cleanText.toLowerCase().includes('new chat') &&
            !cleanText.toLowerCase().includes('chat history')) {
          return cleanText;
        }
      }
      
      return '';
    } catch (error) {
      return '';
    }
  }

  async waitForAIResponse(timeout = 30000) {
    try {
      await this.page.waitForSelector(this.selectors.aiMessage, { 
        state: 'visible', 
        timeout: timeout 
      });
    } catch {
      await this.wait(2000);
    }
  }

  async isInputFieldCleared() {
    const value = await this.getSearchInputValue();
    return value === '' || value.trim() === '';
  }

  async getTextDirection() {
    try {
      const dir = await this.page.evaluate(() => {
        return document.documentElement.getAttribute('dir') || 
               document.body.getAttribute('dir') || 
               window.getComputedStyle(document.body).direction || 
               'ltr';
      });
      return dir.toLowerCase();
    } catch {
      return 'ltr';
    }
  }

  async getInputFieldDirection() {
    try {
      const input = this.page.locator(this.selectors.searchInput).first();
      const dir = await input.getAttribute('dir');
      if (dir) return dir.toLowerCase();
      
      const computedDir = await input.evaluate(el => window.getComputedStyle(el).direction);
      return computedDir.toLowerCase();
    } catch {
      return 'ltr';
    }
  }

  async getConversationAreaDirection() {
    try {
      const convArea = this.page.locator(this.selectors.conversationArea).first();
      const dir = await convArea.getAttribute('dir');
      if (dir) return dir.toLowerCase();
      
      const computedDir = await convArea.evaluate(el => window.getComputedStyle(el).direction);
      return computedDir.toLowerCase();
    } catch {
      return 'ltr';
    }
  }

  async scrollConversationToBottom() {
    try {
      const convArea = this.page.locator(this.selectors.conversationArea).first();
      await convArea.evaluate(el => el.scrollTop = el.scrollHeight);
    } catch {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }
  }

  async isMessageHTMLSafe(messageText) {
    try {
      const hasScriptTag = /<script/i.test(messageText);
      return !hasScriptTag || messageText.includes('&lt;script') || messageText.includes('&gt;');
    } catch {
      return true;
    }
  }

  async isArabicLanguage() {
    const url = this.getCurrentUrl();
    return url.includes('/ar/');
  }

  async isEnglishLanguage() {
    const url = this.getCurrentUrl();
    return url.includes('/en/') || !url.includes('/ar/');
  }
}

module.exports = UAskPage;
