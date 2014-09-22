//automation scripts
var _ = require('underscore');

// Public
var self = module.exports = {
  /**
   * selenium driver object
   * @type {Object}
   */
  driver: null,

  /**
   * selenium driver object
   * @type {Object}
   */
  webdriver: null,

  /**
   * default timeout for webdriver actions
   * @type {Number}
   */
  timeout: 120000,
  
  /**
   * Login
   * @param  {String} username 
   * @param  {String} password
   * @param  {String} url
   */
  login: function(username, password, url) {
  	if (!_.isUndefined(url)) {
  		self.driver.get(url);
  	}
  	self.driver.wait(self.waitCallBack(self.webdriver.By.name("username")), self.timeout);
  	self.findElement(self.webdriver.By.name("username")).sendKeys(username);
  	self.findElement(self.webdriver.By.name("password")).sendKeys(password);
  	self.clickBtn(self.webdriver.By.name("login_button"));
  },

  /**
   * Install App
   * @param  {Object} options
   */
  install: function(options) {
  	self.driver.get(options.url);

  	//wait for finish button
  	var finishBtnLocator = self.webdriver.By.id("button_next2");
  	self.clickBtn(finishBtnLocator, true);
  	
    //login
  	self.login(options.username, options.password);

    //license validation
    self.switchToIframe('bwc-frame', 20000);
    self.licenseValidation(options.licenseFilePath);
    self.driver.sleep(7500);
    self.driver.switchTo().defaultContent();

    //logout
    self.logout();

    //login
    self.login(options.username, options.password);

    //enter user profile
    self.enterUserProfile(options.userEmail, options.userPhone)
    
    //click on done button
    self.clickDoneBtn();

    //switch to admin screen
    self.switchToAdmin();

    //enter connector properties
    self.enterConnectorDetails(options.dnbUsername, options.dnbPassword);

    //switch to admin screen
    self.switchToAdmin();    

    //enter proxy settings
    self.enterProxyDetails(options.proxyHost, options.proxyPort);

  },

  /**
   * Find Element in DOM
   * @param  {Object} locator
   * @return {Object}
   */
  findElement: function(locator) {
  	return self.driver.findElement(locator);
  },

  /**
   * Wait till element is displayed
   * @param  {Object} locator
   * @return {Function}
   */
  waitCallBack: function(locator) {
  	return function() {
  		return self.driver.isElementPresent(locator);
  	}
  },

  /**
   * Click on a button
   * @param  {Object} locator
   * @param  {Boolean} wait
   */
  clickBtn: function(locator, wait) {
  	if (!_.isUndefined(wait)) {
  		self.driver.wait(self.waitCallBack(locator), self.timeout);
  	}
	  self.driver.findElement(locator).click();
  },

  testRoutine: function(options) {
  	self.login(options.username, options.password, options.url);
    self.clickDoneBtn();
  	self.switchToAdmin();
    self.enterConnectorDetails(options.dnbUsername, options.dnbPassword);
  },

  /**
   * switch to iframe
   * @param  {String} iframeID
   */
  switchToIframe: function(iframeID, sleepTime) {
    var iframe = self.webdriver.By.id(iframeID);
    self.driver.sleep(sleepTime);
    self.driver.wait(self.waitCallBack(iframe), self.timeout);
    self.driver.switchTo().frame(iframeID);
  },

  /**
   * send input
   * @param  {Object} locator
   * @param  {String} input
   */
  sendInput: function(locator, input) {
    self.findElement(locator).sendKeys(input);
  },

  /**
   * switchToAdmin
   */
  switchToAdmin: function() {
    var adminTab = self.webdriver.By.id("userActions"),
        adminScreen = self.webdriver.By.css("li.administration a");
    //click on id userTab
    self.clickBtn(adminTab, true);
    //click on li.profileactions-logout a
    self.clickBtn(adminScreen, true);
  },

  /**
   * enterProxyDetails
   * @param  {String} host
   * @param  {String} port
   */
  enterProxyDetails: function(host, port) {
    var systemSettings = self.webdriver.By.xpath("//a[contains(text(),'System Settings')]"),
        proxyChkBox = self.webdriver.By.xpath("//input[contains(@id, 'proxy_on')]"),
        proxyHost = self.webdriver.By.id("proxy_host"),
        proxyPort = self.webdriver.By.id("proxy_port"),
        saveSettings = self.webdriver.By.xpath("//input[contains(@id, 'ConfigureSettings_save_button')]");
    //click on system settings
    self.switchToIframe('bwc-frame', 15000);
    self.clickBtn(systemSettings, true);
    self.driver.switchTo().defaultContent();

    //enter proxy details
    self.switchToIframe('bwc-frame', 10000);
    self.clickBtn(proxyChkBox, true);
    self.sendInput(proxyHost, host);
    self.sendInput(proxyPort, port);
    self.driver.findElement(saveSettings).click();
  },

  /**
   * enterConnectorDetails
   * @param  {String} username
   * @param  {String} apikey
   */
  enterConnectorDetails: function(username, apikey) {
    var connectors = self.webdriver.By.xpath("//a[contains(text(),'Connectors')]"),
        setConnectors = self.webdriver.By.xpath("//img[contains(@name,'connectorConfig')]"),
        dnbConnector = self.webdriver.By.xpath("//div[@id='container']/div/ul/li[last()]/a/em"),
        dnbUsername = self.webdriver.By.xpath("//input[contains(@id, 'ext_rest_dnb_dnb_username')]"),
        dnbPassword = self.webdriver.By.xpath("//input[contains(@id, 'ext_rest_dnb_dnb_password')]"),
        dnbEnv = self.webdriver.By.xpath("//input[contains(@id, 'ext_rest_dnb_dnb_env')]"),
        connectorsSave = self.webdriver.By.xpath("//input[contains(@id, 'connectors_top_save')]");

    //click on connectors
    self.switchToIframe('bwc-frame', 10000);
    self.clickBtn(connectors, true);
    self.driver.switchTo().defaultContent();

    //click on set connector properties
    self.switchToIframe('bwc-frame', 10000);
    self.clickBtn(setConnectors, true);
    self.driver.switchTo().defaultContent();

    //click on D&B Connector Tab
    self.switchToIframe('bwc-frame', 10000);
    self.clickBtn(dnbConnector);
    self.driver.wait(self.waitCallBack(dnbUsername), self.timeout);
    self.sendInput(dnbUsername, username);
    self.sendInput(dnbPassword, apikey);
    // self.sendInput(dnbEnv, 'prod');
    self.clickBtn(connectorsSave);
    self.driver.wait(function() {
      return self.driver.getTitle().then(function(title) {
        return title === "Connector Settings » Administration » SugarCRM";
      });
    }, 25000);
    self.driver.switchTo().defaultContent();
  },

  /**
   * enter user profile details
   * @param  {String} useremail
   * @param  {String} phone
   */
  enterUserProfile: function(useremail, phone) {
    var userEmail = self.webdriver.By.name("email"),
        userPhone = self.webdriver.By.name("phone_work"),
        nextButton = self.webdriver.By.name("next_button"),
        prevBtn = self.webdriver.By.name("previous_button"),
        startSugar = self.webdriver.By.name("start_sugar_button");

    //enter user profile details
    self.driver.wait(self.waitCallBack(userEmail), self.timeout);
    self.driver.sleep(2000);
    self.sendInput(userEmail, 'admin@email.com');
    self.sendInput(userPhone, '1234');
    self.clickBtn(nextButton);
    self.driver.wait(self.waitCallBack(prevBtn), self.timeout);
    self.clickBtn(nextButton);
    self.clickBtn(startSugar, true);
  },

  /**
   * click on done button
   */
  clickDoneBtn: function() {
    var doneBtnLocator = self.webdriver.By.css(".done-btn");
    self.clickBtn(doneBtnLocator, true);
  },

  /**
   * licenseValidation
   * @param  {String} licenseFilePath
   */
  licenseValidation: function(licenseFilePath) {
    var manualValidation  = self.webdriver.By.xpath("//a[contains(text(),'Manual Validation')]"),
        licenseFileInput = self.webdriver.By.name("VKFile");

    self.driver.wait(self.waitCallBack(manualValidation), self.timeout);
    self.clickBtn(manualValidation);
    self.driver.wait(self.waitCallBack(licenseFileInput), self.timeout);
    self.sendInput(licenseFileInput, licenseFilePath);
    self.driver.findElement(licenseFileInput).submit();
  },

  logout: function() {
    var adminTab = self.webdriver.By.id("userActions"),
        logout = self.webdriver.By.css("li.profileactions-logout a");
    //click on id userTab
    self.clickBtn(adminTab, true);
    //click on li.profileactions-logout a
    self.clickBtn(logout, true);
  },
  
};


