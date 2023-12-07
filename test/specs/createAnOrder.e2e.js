const page = require('../../page');
const helper = require('../../helper')

//TEST 1 SETTING THE ADDRESS
describe("Setting the address", () => {
  it("should set a valid address", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Fill in the addresses
    await page.fillAddresses("East 2nd Street, 601", "1300 1st St");

    // Click the "Set Address" button
    const setAddressButton = await $(page.setAddressButton);
    await setAddressButton.click();

    // Wait for the address to be displayed on the UI
    const selectedAddress = await $(page.selectedAddress);
    await selectedAddress.waitForDisplayed();

    // Verify that the selected address is displayed correctly
    const selectedAddressText = await selectedAddress.getText();
    await expect(selectedAddressText).toContain("East 2nd Street, 601");
    await expect(selectedAddressText).toContain("1300 1st St");
  });

  it("should provide address suggestions while typing", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Navigate to the address setting section
    const addressInput = await $(page.addressInput);

    // Start typing a partial address
    await addressInput.setValue("East 2nd Street");

    // Wait for address suggestions to be displayed
    const addressSuggestions = await $$(page.addressSuggestions);
    await addressSuggestions[0].waitForDisplayed();

    // Verify that address suggestions are displayed
    await expect(addressSuggestions).toBeElementsArrayOfSize({ eq: 3 });
  });

  it("should handle invalid address", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Fill in an invalid or non-existent address
    await page.fillAddresses("Invalid Address", "Invalid City");

    // Click the "Set Address" button
    const setAddressButton = await $(page.setAddressButton);
    await setAddressButton.click();

    // Verify that an error message is displayed
    const errorMessage = await $(page.errorMessage);
    await errorMessage.waitForDisplayed();
    await expect(errorMessage).toHaveTextContaining("Invalid address");
  });

  it("should use geolocation to set the current location", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Click the "Use Current Location" button
    const useCurrentLocationButton = await $(page.useCurrentLocationButton);
    await useCurrentLocationButton.click();

    // Wait for the current location to be set
    const selectedAddress = await $(page.selectedAddress);
    await selectedAddress.waitForDisplayed();

    // Verify that the address is set to the current location
    const selectedAddressText = await selectedAddress.getText();
    await expect(selectedAddressText).toContain("Current Location");
  });
});

//TEST 2 SELECTING SUPPORTIVE PLAN
describe("Selecting Supportive Plan", () => {
  it("should select a supportive plan", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Select a supportive plan
    const supportivePlanOption = await $(page.supportivePlanOption);
    await supportivePlanOption.click();

    // Wait for the plan to be selected
    const selectedPlan = await $(page.selectedPlan);
    await selectedPlan.waitForDisplayed();

    // Verify that the selected plan is displayed correctly
    const selectedPlanText = await selectedPlan.getText();
    await expect(selectedPlanText).toContain("Supportive Plan");
  });

  it("should display additional information for the selected plan", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Select a supportive plan
    const supportivePlanOption = await $(page.supportivePlanOption);
    await supportivePlanOption.click();

    // Wait for the plan to be selected
    const selectedPlan = await $(page.selectedPlan);
    await selectedPlan.waitForDisplayed();

    // Click on the selected plan to view additional information
    await selectedPlan.click();

    // Wait for the additional information to be displayed
    const additionalInfoModal = await $(page.additionalInfoModal);
    await additionalInfoModal.waitForDisplayed();

    // Verify that the modal contains relevant information
    const modalText = await additionalInfoModal.getText();
    await expect(modalText).toContain("Supportive Plan Details");
    await expect(modalText).toContain("Special features and benefits");
  });

  it("should not allow selecting more than one plan", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Select a supportive plan
    const supportivePlanOption = await $(page.supportivePlanOption);
    await supportivePlanOption.click();

    // Select another plan (assuming an attempt is made to select more than one plan)
    const premiumPlanOption = await $(page.premiumPlanOption);
    await premiumPlanOption.click();

    // Verify that only one plan is selected
    const selectedPlans = await $$(page.selectedPlan);
    await expect(selectedPlans).toBeElementsArrayOfSize({ eq: 1 });
  });
});


//TEST 3 FILLING IN THE PHONE NUMBER
describe('Create an order', () => {
    it('should open phone number modal', async () => {
        await browser.url(`/`)
        await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
        const phoneNumberButton = await $(page.phoneNumberButton);
        await phoneNumberButton.waitForDisplayed();
        await phoneNumberButton.click();
        const pnoneNumberModal = await $(page.phoneNumberModal);
        await expect(pnoneNumberModal).toBeExisting();
    })

    it('should save the phone', async () => {
        await browser.url(`/`)
        await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
        const phoneNumber = helper.getPhoneNumber("+1");
        await page.submitPhoneNumber(phoneNumber);
        await expect(await helper.getElementByText(phoneNumber)).toBeExisting();
    })
})


//TEST 4 ADDING A CREDIT CARD
describe("Adding a Credit Card", () => {
  it('should activate the "link" button after CVV field loses focus', async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Trigger the process of adding a credit card
    const addCreditCardButton = await $(page.addCreditCardButton);
    await addCreditCardButton.click();

    // Fill in credit card details
    await page.fillCreditCardDetails(
      "John Doe",
      "4111111111111111",
      "12/23",
      "123"
    );

    // Move focus away from the CVV field (simulate the user pressing TAB)
    await browser.keys("Tab");

    // Verify that the "link" button becomes active
    const linkButton = await $(page.linkButton);
    await linkButton.waitForEnabled();
    await expect(linkButton).toBeClickable();
  });

  it("should successfully link the credit card", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Trigger the process of adding a credit card
    const addCreditCardButton = await $(page.addCreditCardButton);
    await addCreditCardButton.click();

    // Fill in credit card details
    await page.fillCreditCardDetails(
      "Jane Doe",
      "4222222222222",
      "11/24",
      "456"
    );

    // Move focus away from the CVV field (simulate the user pressing TAB)
    await browser.keys("Tab");

    // Click the "link" button
    const linkButton = await $(page.linkButton);
    await linkButton.click();

    // Verify that the credit card is successfully linked
    const successMessage = await $(page.successMessage);
    await successMessage.waitForDisplayed();
    await expect(successMessage).toHaveTextContaining(
      "Credit card linked successfully"
    );
  });
});


//TEST 5 WRITING A MESSAGE TO THE DRIVER
describe("Writing a Message for the Driver", () => {
  it("should write and send a message to the driver", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Select a specific ride or order a taxi to get to the driver messaging screen
    // This might involve interacting with elements such as selecting a destination, choosing a car, etc.

    // Open the driver messaging screen
    const openMessagingButton = await $(page.openMessagingButton);
    await openMessagingButton.click();

    // Write a message in the text input field
    const messageInput = await $(page.messageInput);
    await messageInput.setValue("Hey, I'll be ready in 5 minutes!");

    // Click the "Send" button
    const sendButton = await $(page.sendButton);
    await sendButton.click();

    // Verify that the message is sent successfully
    const sentMessage = await $(page.sentMessage);
    await sentMessage.waitForDisplayed();
    await expect(sentMessage).toHaveTextContaining(
      "Hey, I'll be ready in 5 minutes!"
    );
  });
});


//TEST 6 ORDERING A BLANKET AND HANDKERCHIEFTS
describe("Ordering a Blanket and Handkerchiefs", () => {
  it("should add items to the cart and verify the state change", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Find and click on the selector to add a blanket to the cart
    const addBlanketButton = await $(page.addBlanketButton);
    await addBlanketButton.click();

    // Verify the state change using a different selector
    const cartItemCount = await $(page.cartItemCount);
    await cartItemCount.waitForDisplayed();
    await expect(cartItemCount).toHaveText("1");

    // Find and click on the selector to add handkerchiefs to the cart
    const addHandkerchiefsButton = await $(page.addHandkerchiefsButton);
    await addHandkerchiefsButton.click();

    // Verify the state change for handkerchiefs
    await cartItemCount.waitForDisplayed();
    await expect(cartItemCount).toHaveText("2");

    // Optionally, you can proceed to the checkout process or other steps as needed.
  });
});


//TEST 7 ORDERING 2 ICECREAMS
describe("Ordering 2 Ice Creams", () => {
  it("should add 2 ice creams to the cart", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Find and click on the selector to add the first ice cream to the cart
    const addIceCreamButton = await $(page.addIceCreamButton);
    await addIceCreamButton.click();

    // Verify the state change using a selector representing the cart item count
    const cartItemCount = await $(page.cartItemCount);
    await cartItemCount.waitForDisplayed();
    await expect(cartItemCount).toHaveText("1");

    // Add another ice cream to the cart
    await addIceCreamButton.click();

    // Verify the state change for the second ice cream
    await cartItemCount.waitForDisplayed();
    await expect(cartItemCount).toHaveText("2");

    // Optionally, you can proceed to the checkout process or other steps as needed.
  });
});


//TEST 8 THE CAR SEARCH MODAL APPEARS
describe("Car Search Modal", () => {
  it("should appear when initiating a car search", async () => {
    // Navigate to the application URL
    await browser.url("/");

    // Find and click on the selector to initiate a car search
    const initiateCarSearchButton = await $(page.initiateCarSearchButton);
    await initiateCarSearchButton.click();

    // Verify that the car search modal appears
    const carSearchModal = await $(page.carSearchModal);
    await carSearchModal.waitForDisplayed();
    await expect(carSearchModal).toBeDisplayed();

    // Optionally, you can include additional verifications or interactions with the modal.
  });
});


//TEST 9 WAITING FOR THE DRIVER INFO TO APPEAR (0PTIONAL)
//TEST 9 SKIPPED
// laris@DESKTOP-N872TU8 MINGW64 ~/projects $ npx wdio run ../wdio.conf.js or npx wdio run ./hm08-qa-us/wdio.conf.js