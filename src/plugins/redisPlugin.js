import Redis from 'ioredis'
import electronPlugin from './electronPlugin'
import fs from 'fs'

export const redisConfigPath = `${electronPlugin.getConfigPath()}/redisConfig.json`

export function readRedisConfig () {
  let data = []
  try {
    fs.accessSync(redisConfigPath)
    let fData = fs.readFileSync(redisConfigPath)
    fData = JSON.parse(fData)
    if (fData) {
      data = fData
    }
    return data
  } catch (err) {
    console.warn('读取配置失败', err)
    return []
  }
}

export function writeRedisConfig (configList) {
  return new Promise((resolve, reject) => {
    fs.writeFile(redisConfigPath, JSON.stringify(configList, null, '  '), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function connectRedis (config) {
  return new Promise((resolve, reject) => {
    let conn = new Redis({
      host: config.host,
      port: config.port,
      password: config.password
    })
    conn.on('connect', () => {
      console.log('连接成功')
      resolve(conn)
    })
    conn.on('error', e => {
      conn.disconnect(false)
      console.log('连接失败', e)
      reject(e)
    })
  })
}

export default {
  redisConfigPath,
  readRedisConfig,
  writeRedisConfig,
  connectRedis,
  install (Vue) {
    Vue.prototype.$redisConfigPath = redisConfigPath
    Vue.prototype.$connectRedis = connectRedis
  }
}
