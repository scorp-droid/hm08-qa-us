# Sprint 8 project
Overview
This is project 8 of TripleTen's QA bootcamp. This project taught aspiring QA engineers how to write automated tests using NPM and JavaScript. 
Webdriver for browswer automation, and Mocha as the testing framework were also used to test the functionality of Urban Routes.
Functionality that was tested included: Setting the address, adding a credit card, writing a message for the driver, among others.


Installation
To install the project's dependencies, use the following command:
npm install
This will install all the necessary packages and libraries required for the project.

Configuration
Before running the tests, make sure to set the test URL in the configuration file. Locate the wdio.config.js file in the project directory and update the BASE_URL variable with the appropriate test URL:
// wdio.config.js
exports.config = {
    BASE_URL: 'https://example.com/test',
    // ... other configuration options
};

How to Run Tests
To run the test suite, use the following commands in your project directory: 
npm install
npx wdio run ./path/to/wdio/file
These commands will execute the tests and provide the test results, including any failures or errors.
