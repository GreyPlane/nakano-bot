/* eslint-disable sort-keys */
import { Contact, Message, ScanStatus, Wechaty, log } from 'wechaty'

import { generate } from 'qrcode-terminal'
import { finis } from 'finis'
import { main, action } from './action'
import { format, readCache, writeCache, readRecord, writeRecord } from './uitl'
import { whiteList, token } from './config'

let infos = readCache()
let lock: boolean = false

function onScan (qrcode: string, status: ScanStatus) {
  if (status !== ScanStatus.Confirmed) {
    generate(qrcode)
  }
}

function onLogin (user: Contact) {
  bot.userSelf().say('zhongyeeeeeee').catch(e => log.error(e))
  log.info('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg: Message) {
  log.info('中野收到了信息')
  const sender = msg.from()
  if (sender.self() || whiteList.includes(sender.name())) {
    try {
      const data = format(msg.text())
      infos.push({ data, timestamp: new Date() })
    } catch (error) {
      if (error.message === 'wrong format') {
        await msg.from().say(`
        请按照以下格式输入注册信息（注意是汉字括号和逗号）：
        1，名字：user
        2，生日：1990-02-22
        3，收货地址：whatever
        4，身份证号码：123921939213
        5，电子邮箱：123123132
        6，电话号码：123123213
        7，数量：4瓶
        8，你想要的用户名：名字加电话号码后四位
        9，推荐人ID：dogshark`)
      }
    }
  }
}

const bot = new Wechaty({
  name: 'wechaty',
  puppet: 'wechaty-puppet-padplus',
  puppetOptions: { token },
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot
  .start()
  .then(() => log.info('bot start'))
  .catch((e) => log.error('StarterBot', e))

finis(async (code, signal) => {
  if (infos.length !== 0) {
    writeCache(infos)
  }
  await bot.logout()
  process.exit(0)
})

action.on('ok', () => {
  const info = infos.shift()
  let data = readRecord()
  data.push({ timestamp: info.timestamp, ...info.data })
  writeRecord(data)
})
action.on('ejeck', () => bot.userSelf().say('中野弹射！'))

setInterval(() => {
  if (infos.length > 0 && lock === false) {
    const info = infos[0]
    lock = true
    return main(info.data)
      .catch((e) => log.error(e))
      .finally(() => (lock = false))
  }
}, 3000)
