/* eslint-disable sort-keys */
import {
  Builder,
  Browser,
  Condition,
  By,
} from 'selenium-webdriver'
import { Options, Driver } from 'selenium-webdriver/chrome'
import { log } from 'wechaty'
import { EventEmitter } from 'events'

/// ////////////////
/// /// 祥 瑞 //////
/// ///////////////
const shark = true

enum FORM_FIELDS {
  HEADER,
  PERSONAL_INFO,
  ADDRESS,
  DOMAIN,
  FEE,
  REWARDS,
  CREDIT_CARD,
  AGREEMENT,
  CAPTCHA
}
export interface FormData {
  name: string;
  firstName: string;
  phoneNumber: number;
  email: string;
  address: string;
  username: string;
  password: string;
  id: string;
  recommendId: string;
}
class ActionEventEmitter extends EventEmitter {};
export const action = new ActionEventEmitter()

export const main = async (data: FormData) => {
  const proxyUrl = 'localhost:2802'
  const options = new Options()
  options.setProxy({
    proxyType: 'MANUAL',
    httpProxy: proxyUrl,
    sslProxy: proxyUrl,
    socksProxy: 'localhost:2801',
  })
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build()
  try {

    await driver.get(
      `placeholder`
    )
    await driver.sleep(3000)
    const buttonTagName = By.tagName('button')
    const itemButton = await (
      await driver.findElement(By.tagName('ds-product'))
    ).findElement(buttonTagName)
    await itemButton.click()
    await driver.sleep(3000)
    const navigationButtonTagName = By.tagName('ds-navigation-button')
    let continueButton = await (
      await driver.findElement(navigationButtonTagName)
    ).findElement(buttonTagName)
    await continueButton.click()
    await driver.sleep(3000)
    continueButton = await (
      await driver.findElement(navigationButtonTagName)
    ).findElement(buttonTagName)
    await continueButton.click()
    await driver.sleep(3000)
    const formCards = await driver.findElements(By.className('ds-card'))

    // process form info
    const inputTagName = By.tagName('input')
    const selectTagName = By.tagName('select')
    const rowClassName = By.className('ds-row')
    let card = formCards[FORM_FIELDS.PERSONAL_INFO]
    let rows = await card.findElements(By.className('ds-row'))
    // names
    let inputs = await rows[0].findElements(inputTagName)
    await inputs[0].sendKeys(data.name)
    await inputs[1].sendKeys(data.firstName)
    // phone
    inputs = await rows[2].findElements(inputTagName)
    await inputs[0].sendKeys(data.phoneNumber)
    // email
    inputs = await rows[3].findElements(inputTagName)
    await inputs[0].sendKeys(data.email)
    // address
    card = formCards[FORM_FIELDS.ADDRESS]
    rows = await card.findElements(By.className('ds-row'))
    inputs = await rows[2].findElements(inputTagName)
    await inputs[0].sendKeys(data.address)
    // username
    card = formCards[FORM_FIELDS.DOMAIN]
    rows = await card.findElements(By.className('ds-row'))
    inputs = await rows[0].findElements(inputTagName)
    await inputs[0].sendKeys(data.username)
    // password
    inputs = await rows[1].findElements(inputTagName)
    await Promise.all(inputs.map(input => input.sendKeys(data.password)))
    // idCard
    card = formCards[FORM_FIELDS.REWARDS]
    rows = await card.findElements(rowClassName)
    inputs = await rows[0].findElements(inputTagName)
    await inputs[0].sendKeys(data.id)
    // check
    await driver.sleep(3000)
    card = formCards[FORM_FIELDS.AGREEMENT]
    inputs = await card.findElements(inputTagName)
    await Promise.all(inputs.map(input => input.click()))
    action.emit('ejeck')
    const formUrl = await driver.getCurrentUrl()
    await driver.wait(new Condition('url change', async (drv) => {
      const url = await drv.getCurrentUrl()
      return !(formUrl === url)
    }))
    log.info('检测到url改变，准备结束')
    await driver.sleep(5000)
    await driver.quit()
    action.emit('ok')
  } catch (error) {
    await driver.quit()
    throw new Error(error);
  }
}
