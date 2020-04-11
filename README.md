# nakano-bot

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-blue.svg)](https://github.com/chatie/wechaty)

This is a bot that aimed to receive message from wechat contact and format it to data, then call selenium to complete the register procedure semi-automatically.
The sensitive info has been replaced by placeholder(such as token, whiteList etc...), it's mainly for my own personal useage, so sry for any inconvenience.

## REQUIREMENTS

1. Node.js v10 or above
2. Build Tools for your Platform
3. WebDriver for your browser

## GETTING STARTED

### 0. Install Node.js and WebDriver(>=10)

If you have not installed Node.js(or version is below 10),You need to install the latest version of Node.js first by following the links below:

* [Windows](https://nodejs.org/en/download/package-manager/#windows)
* [Linux(Debian/Ubuntu)](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* [macOS](https://nodejs.org/en/download/package-manager/#macos)

> Instal Node.js for other platforms can be found at <https://nodejs.org/en/download/package-manager/>
> Check the puppet page [Puppet](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty) to know about token and complie preparation.
> Download the WebDriver [Chrome](https://sites.google.com/a/chromium.org/chromedriver/downloads) and put it into your system's PATH env variable.

### 1. Clone this Repository

```sh
git clone https://github.com/lijiarui/wechaty-getting-started.git
cd wechaty-getting-started
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Run the Bot

replace token and other config in config.ts and customize your own action in action.ts.

```sh
npm start:ts
```

You are all set!
