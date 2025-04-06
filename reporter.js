const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: './reports/cucumber-report.json',
    output: './reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
        'Test Environment': 'Local',
        'Browser': process.env.BROWSER || 'chromium',
    },
};

reporter.generate(options);
