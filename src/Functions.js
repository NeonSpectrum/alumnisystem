import crypto from 'crypto'

const ENCRYPTION_KEY = 'W8pbSj8UVwVU0nuvLhcquia4jR3ViHMz' // Must be 256 bytes (32 characters)
const IV_LENGTH = 16 // For AES, this is always 16

const encrypt = text => {
  let iv = crypto.randomBytes(IV_LENGTH)
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = text => {
  let textParts = text.split(':')
  let iv = new Buffer(textParts.shift(), 'hex')
  let encryptedText = new Buffer(textParts.join(':'), 'hex')
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

const fetchHTML = (url, headers) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await (await fetch(url, {
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

const fetchJSON = (url, headers) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await (await fetch(url, {
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

const validateAuth = async item => {
  let data = await fetchJSON('/api/login', {
    method: 'POST',
    body: decrypt(item)
  })
  return data.success
}

const getSessionData = () => {
  return JSON.parse(decrypt(sessionStorage.auth))
}

const logout = () => {
  sessionStorage.removeItem('auth')
}

export { fetchJSON, fetchHTML, validateAuth, encrypt, decrypt, logout, getSessionData }
