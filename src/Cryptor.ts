import fs from 'fs'
import crypto from 'crypto'
import process from 'process'
import * as openpgp from 'openpgp'
import debugLogger from 'debug'

// TODO: this entire file needs to be more legit with its await. Catch em all
const debug = debugLogger('decrypt');

// TODO: flow type annotations
// TODO: funciton docs

export default class Cryptor {
  _algo: string
  _iv: Buffer
  _key!: Buffer
  // TODO: revise what the '!' operator does again?
  _privKey!: string
  _pubKey!: string
  _privCipher!: openpgp.key.Key
  _pubCipher!: openpgp.key.Key
  _cipher!: crypto.Cipher
  _decipher!: crypto.Decipher
  constructor(key?: Buffer, iv: Buffer = Cryptor.genRandomIVSync(), algo: string = 'id-aes256-GCM') {
    // TODO: take in asym keys if provided
    this._algo = algo
    this._iv = iv
    // TODO: generate salt ?
    if (key) {
      this._key = key
      this._cipher = crypto.createCipheriv(algo, this._key, this._iv)
      this._decipher = crypto.createDecipheriv(algo, this._key, this._iv)
    }
  }

  // used for asymmetric encryption
  async loadKeyPair(privKey: string, pubKey: string, passphrase: string = ''): Promise<void> {
    this._privCipher = (await openpgp.key.readArmored(privKey)).keys[0]
    try {
      await this._privCipher.decrypt(passphrase)
    } catch(err) {
      throw err;
    }
    this._pubCipher = (await openpgp.key.readArmored(pubKey)).keys[0]
  }

  async loadPrivateKey(privKey: string, passphrase: string = ''): Promise<void> {
    this._privKey = privKey
    this._privCipher = (await openpgp.key.readArmored(privKey)).keys[0]
    await this._privCipher.decrypt(passphrase)
  }

  async loadPublicKey(pubKey: string): Promise<void> {
    this._pubKey = pubKey
    this._pubCipher = (await openpgp.key.readArmored(pubKey)).keys[0]
  }

  async publicEncrypt(data: string|Buffer): Promise<string> {
    let message;
    if (typeof data === 'string') {
      message = openpgp.message.fromText(data)
    } else {
      // TODO: is this legit?
      message = openpgp.message.fromText(data.toString())
    }

    const options = {
      message: message,
      publicKeys: [this._pubCipher], // for encryption
    }

    const ciphertext = await openpgp.encrypt(options)

    return ciphertext.data
  }

  async privateDecrypt(ciphertext: string): Promise<string> {
    const message = await openpgp.message.readArmored(ciphertext)
    const options = {
      message: message,    // parse armored message
      privateKeys: [this._privCipher]                                 // for decryption
    }
    const plaintext = await openpgp.decrypt(options)

    // TODO: dont think this is legit?
    return <string>plaintext.data
  }

  async signData(data: string|Buffer, privkey?: {key: string, passphrase: string}): Promise<string> {
    let key;
    if (privkey) {
      key = (await openpgp.key.readArmored(privkey.key)).keys[0]
      key.decrypt(privkey.passphrase)
    } else {
      key = this._privCipher
    }

    let message;
    if (typeof data === 'string') {
      message = openpgp.message.fromText(data)
    } else {
      // TODO: is this legit?
      message = openpgp.message.fromText(data.toString())
    }

    const options = {
      message: message,
      privateKeys: key
    }

    const signed = await openpgp.sign(options)

    return signed.data
  }

  async verifyData(data: string|Buffer, pubkey ?: string): Promise<Boolean> {
    let key;
    if (pubkey) {
      key = (await openpgp.key.readArmored(pubkey)).keys[0]
    } else {
      key = this._pubCipher
    }

    if (typeof data !== 'string') {
      data = data.toString()
    }


    let message
    try {
      message = await openpgp.message.readArmored(data)
    } catch(err) {
      console.log(err)
      return false;
    }

    const options = {
      message: message, // parse armored message
      publicKeys: key // for verification
    }

    // const valid = (await openpgp.verify(options)).signatures[0].valid
    try {
      const verification = (await openpgp.verify(options))
      const valid = verification.signatures[0].valid
      return valid
    } catch(err) {
      console.log(err)
      return false;
    }

  }

  hashSync(data: string|Buffer, outputEncoding: 'hex' | 'latin1' |  'base64' = 'hex'): Buffer {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();
  }

  encryptSync(plainBuf: Buffer, iv?: Buffer) {
    if (iv && (iv !== this._iv)) {
      this._resetCipher(iv);
    }
    return this._cipher.update(plainBuf);
  }

  // TODO: needs iv param
  // WARNING: I'm not truly async
  encrypt(...args: Array<any>) {
    let argSplit = this._separateCallback(args)
    let cb = argSplit.cb;
    let methodArgs = argSplit.args;


    this._callAsync(
      this.encryptSync.bind(this),
      methodArgs,
      cb
    );
    return;
  }

  decryptSync(cipherBuf: Buffer, iv?: Buffer) {
    if (iv && (iv !== this._iv)) {
      this._resetDecipher(iv);
    }

    return this._decipher.update(cipherBuf);
  }

  // TODO: needs iv param
  // WARNING: I'm not truly async
  decrypt(...args: Array<any>) {
    let argSplit = this._separateCallback(args)
    let cb = argSplit.cb;
    let methodArgs = argSplit.args;

    this._callAsync(
      this.decryptSync.bind(this),
      methodArgs,
      cb
    );
    return;
  }

  _resetCipher(iv: Buffer) {
    this._cipher = crypto.createCipheriv(this._algo, this._key, iv);

    return;
  }

  _resetDecipher(iv: Buffer) {
    this._decipher = crypto.createDecipheriv(this._algo, this._key, iv);

    return;
  }

  static genRandomIVSync() {
    return crypto.randomBytes(16);
  }

  static randomBytes(size: number) {
    return crypto.randomBytes(size);
  }
  //encyrpt ()
  // nextrick(encryptrSync
  // if ^^ fails set err else set jults and do callback(err, result)

  // TODO: should all of these be public methods?
  // ========= HELPER FUNCTIONS =============
  _callAsync(syncFn: Function, args: Array<any>, cb: Function) {
    process.nextTick(() => {
      try {
        let result = syncFn(...args);


        cb(null, result);

      } catch (e) {
        cb(e, null);
      }
    });
  }

  _separateCallback(args: Array<any>) {
    // it is js convection that the last parameter
    // will be the callback

    // pop 'mandatory' callback
    // TODO: should we be checking that cb is a function?
    let cb = args.pop();

    return {
      cb: cb,
      args: args
    };

  }

  static pbkdfSync(pass: string, salt: string|Buffer = '', algo: string = 'sha256', keyLen: number = 32, numIterations: number = 10000) {
    return crypto.pbkdf2Sync(pass, salt, numIterations, keyLen, algo);
    //return crypto.pbkdf2Sync(pass, salt, numIterations, keyLen, algo);
  }

  static pbkdf(pass: string, salt: string = '', algo: string = 'sha256', keyLen: number = 32, numIterations: number = 10000, callback: (x: Error|null, y: Buffer) => void) {
    let err = null;
    crypto.pbkdf2(pass, salt, numIterations, keyLen, algo, (err, key) => {
      callback(err, key);
    });
  }

  // TODO: should there be an input param for variable length iv?
}

