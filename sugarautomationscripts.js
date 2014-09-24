var webdriver = require('selenium-webdriver'),
	util = require('util'),
	_ = require('underscore'),
	autoUtils = require('./automation-scripts');

var chromeCapabilities = webdriver.Capabilities.chrome();
//setting chrome options
var chromeOptions = {
    'args': ['--test-type', '--start-maximized']
};
chromeCapabilities.set('chromeOptions', chromeOptions);

var driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
var branchName =  _.isUndefined(process.argv[3]) ? 'master' : process.argv[3], 
    hostName = _.isUndefined(process.argv[2]) ? 'localhost' : process.argv[2],
    installApp = _.isUndefined(process.argv[4]) ? false : (process.argv[4] === '-i'),
    appTmpl = 'http://%s/%s/pro/sugarcrm/',
    username = 'xxxx',
    password = 'xxxx',
    timeout = 1200000;

var appUrl = util.format(appTmpl, hostName, branchName),
    options = {};
options.url = appUrl;
autoUtils.driver = driver;
autoUtils.webdriver = webdriver;
autoUtils.install(options);


