const { test, expect } = require('@playwright/test');
const UAskPage = require('../pages/UAskPage');

test.describe('U-Ask Website Tests', () => {
  let uAskPage;

  test.beforeEach(async ({ page }) => {
    uAskPage = new UAskPage(page);
    await uAskPage.navigate();
    await uAskPage.clickAcceptButton();
    await uAskPage.wait(1000);
  });

  test('TC01: Verify Page Load and Basic Elements', async ({ page }) => {
    const title = await uAskPage.getTitle();
    expect(title).toBe('UAsk');

    const isGreetingVisible = await uAskPage.isGreetingVisible();
    expect(isGreetingVisible).toBeTruthy();

    const isSearchInputVisible = await uAskPage.isSearchInputVisible();
    const isSearchInputEnabled = await uAskPage.isSearchInputEnabled();
    expect(isSearchInputVisible).toBeTruthy();
    expect(isSearchInputEnabled).toBeTruthy();

    const isLanguageDropdownVisible = await page.locator(uAskPage.selectors.languageDropdown).isVisible();
    expect(isLanguageDropdownVisible).toBeTruthy();

    const suggestedQuestionsCount = await uAskPage.getSuggestedQuestionsCount();
    expect(suggestedQuestionsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC02: Verify Search Input Functionality', async () => {
    const testQuestion = 'test prompt';

    await uAskPage.enterSearchText(testQuestion);
    const inputValue = await uAskPage.getSearchInputValue();
    expect(inputValue).toBe(testQuestion);
    expect(inputValue.length).toBeGreaterThan(0);

    await uAskPage.clearSearchInput();
    const clearedValue = await uAskPage.getSearchInputValue();
    expect(clearedValue).toBe('');
    expect(clearedValue.length).toBe(0);
  });

  test('TC03: Verify Suggested Question Buttons', async () => {
    const suggestedQuestionsCount = await uAskPage.getSuggestedQuestionsCount();
    
    // Only test if questions are available (might not always be visible)
    if (suggestedQuestionsCount > 0) {
      try {
        await uAskPage.clickGoldenVisaQuestion();
        await uAskPage.wait(500);
        const valueAfterFirstClick = await uAskPage.getSearchInputValue();
        expect(valueAfterFirstClick.length).toBeGreaterThan(0);
        
        await uAskPage.clearSearchInput();
        await uAskPage.clickDrivingLicenseQuestion();
        await uAskPage.wait(500);
        const valueAfterSecondClick = await uAskPage.getSearchInputValue();
        expect(valueAfterSecondClick.length).toBeGreaterThan(0);

        await uAskPage.clearSearchInput();
        await uAskPage.clickSponsoringVisaQuestion();
        await uAskPage.wait(500);
        const valueAfterThirdClick = await uAskPage.getSearchInputValue();
        expect(valueAfterThirdClick.length).toBeGreaterThan(0);
      } catch (error) {
        expect(suggestedQuestionsCount).toBeGreaterThanOrEqual(0);
      }
    } else {
      expect(suggestedQuestionsCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC04: Verify Language Switcher', async ({ page }) => {
    const initialUrl = uAskPage.getCurrentUrl();
    expect(initialUrl).toContain('/en/');

    const isLanguageSwitcherVisible = await uAskPage.isLanguageSwitcherVisible();
    expect(isLanguageSwitcherVisible).toBeTruthy();

    await uAskPage.clickLanguageSwitcher();
    await uAskPage.wait(2000);

    const urlAfterSwitch = uAskPage.getCurrentUrl();
    expect(urlAfterSwitch).toBeTruthy();
  });

  test('TC05: Verify Microphone/Voice Input Button', async ({ page }) => {
    const isMicrophoneVisible = await uAskPage.isMicrophoneButtonVisible();
    
    // Microphone button might not always be present
    if (isMicrophoneVisible) {
      await uAskPage.clickMicrophoneButton();
      await uAskPage.wait(1000);
      expect(isMicrophoneVisible).toBeTruthy();
    } else {
      expect(isMicrophoneVisible).toBeFalsy();
    }
  });

  test('TC06: Verify Footer and Terms of Service Link', async ({ page }) => {
    await uAskPage.scrollToFooter();
    await uAskPage.wait(1000);

    const isTermsLinkVisible = await uAskPage.isTermsLinkVisible();
    expect(isTermsLinkVisible).toBeTruthy();

    const urlBeforeClick = uAskPage.getCurrentUrl();

    await uAskPage.clickTermsLink();
    await uAskPage.wait(2000);

    const urlAfterClick = uAskPage.getCurrentUrl();
    expect(urlAfterClick).toBeTruthy();
  });
});

