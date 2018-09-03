import crypto from 'crypto'

export const API_URL = 'http://localhost:3000/api'
export const ENCRYPTION_KEY = 'W8pbSj8UVwVU0nuvLhcquia4jR3ViHMz'
export const IV_LENGTH = 16

export const encrypt = text => {
  let iv = crypto.randomBytes(IV_LENGTH)
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = text => {
  let textParts = text.split(':')
  let iv = new Buffer(textParts.shift(), 'hex')
  let encryptedText = new Buffer(textParts.join(':'), 'hex')
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export const fetchHTML = (url, headers) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await (await fetch(API_URL + url, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          ...headers
        })).text()
      )
    } catch (err) {
      reject(err)
    }
  })
}

export const fetchJSON = (url, headers) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await (await fetch(API_URL + url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          ...headers
        })).json()
      )
    } catch (err) {
      reject(err)
    }
  })
}

export const validateAuth = async item => {
  let data = await fetchJSON('/admin/login', {
    method: 'POST',
    body: decrypt(item.token)
  })
  return data.success
}

export const getSessionData = () => {
  return JSON.parse(decrypt(sessionStorage.auth))
}

export const logout = () => {
  sessionStorage.removeItem('auth')
}
