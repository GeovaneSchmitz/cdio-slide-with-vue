const incstr = require('incstr')
const crypto = require('crypto')

class ClassStore {
  constructor({ skipRegex, alphabet }) {
    this.skipRegex = skipRegex
    this.generateNextId = incstr.idGenerator({
      alphabet: this.randomizerAlphabet(alphabet),
    })
    this.index = {}
  }

  randomizerAlphabet(alphabet) {
    const chars = alphabet.split('')
    const charLength = chars.length
    const newOrdemChars = []
    for (let i = 0; i < charLength; i++) {
      const index = crypto.randomInt(0, chars.length)
      newOrdemChars.push(chars.splice(index, 1)[0])
    }
    return newOrdemChars.join('')
  }

  getName(localName, filename) {
    const isGlobal = localName.match(/^_/)
    if (isGlobal) filename = 'global'

    const key = localName + '-' + filename
    if (this.index[key]) {
      return this.index[key]
    }
    let nextId
    do {
      nextId = this.generateNextId()
    } while (nextId.match(this.skipRegex))

    this.index[key] = nextId

    return this.index[key]
  }
}

module.exports = {
  classes: new ClassStore({
    skipRegex: /^[0-9]/,
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  }),
  variables: new ClassStore({
    skipRegex: /^[0-9]/,
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  }),
  keyframes: new ClassStore({
    skipRegex: /^[0-9]/,
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  }),
  // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
  classInCss: new ClassStore({
    skipRegex:
      /(^[0-9_-])|a[-_]*?d|spon|ban|google|affilia|MPU|promo|sba|ablock|reklam|([0-9_]x[0-9])|(-|_)[0-9]+$|^ch$|^mw$|^ra$|^ddb$|^mod$|^openx$|^quigo$|^gbfwa$|^rhsvw$|^imuBox$|^wpmrec$/gi,
    alphabet:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
  }),
}
