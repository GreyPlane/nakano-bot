/* eslint-disable sort-keys */
import { FormData } from './action'
import { write, read, exists, append } from 'fs-jetpack'
import { cachePath, recordPath } from './config'
import { AssertionError } from 'assert'
/*
1，名字：user
2，生日：1990-02-22
3，收货地址：whatever
4，身份证号码：123921939213
5，电子邮箱：123123132
6，电话号码：123123213
7，数量：4瓶
8，你想要的用户名：名字加电话号码后四位
9，推荐人ID：wqeqwe
*/
export const format = (raw: string) => {
  const pattern = /(1，名字：\D+)\s*(2，生日：.+)\s*(3，收货地址：.+)\s*(4，身份证号码：.+)\s*(5，电子邮箱：.+)\s*(6，电话号码：\d+)\s*(7，数量：.+)\s*(8，你想要的用户名：.+)\s*(9，推荐人ID：.+)\s*/
  const result = pattern.exec(raw)
  if (result === null) {
    throw new Error('wrong format')
  } else {
    const split2 = (str: string) => str.split('：')[1]
    const name = split2(result[1])
    const firstName = name[0]
    const phoneNumber = +split2(result[6])
    const email = split2(result[5])
    const address = split2(result[3])
    const username = split2(result[8])
    const id = split2(result[4])
    const recommendId = split2(result[9])
    const birthday = split2(result[2]).split('-')
    const password = `Birth${birthday[0].substring(2)}${birthday[1]}${
      birthday[2]
    }`
    const data: FormData = {
      firstName,
      name,
      phoneNumber,
      email,
      address,
      username,
      password,
      id,
      recommendId,
    }
    return data
  }
}
export const readCache = (dir = cachePath) => {
  if (exists(dir) && exists(dir) === 'file') {
    const data = read(dir, 'json')
    assertFormDataArray(data)
    return data
  } else {
    return []
  }
}
export const writeCache = (data: CacheData[], dir = cachePath) => {
  write(cachePath, data)
}
export const readRecord = (dir = recordPath) => {
  return read(dir, 'json') || []
}
export const writeRecord = (data:any, dir = recordPath) => {
  write(dir, data)
}
interface CacheData {
  data: FormData,
  timestamp: Date
}
function assertFormDataArray (d:any): asserts d is CacheData[] {
  if (!(Array.isArray(d) && d.every(d => d.timestamp !== undefined))) {
    throw new AssertionError({ message: 'not a cache data' })
  }
}
