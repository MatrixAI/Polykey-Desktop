import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import { fstat } from 'fs';
import fs from 'fs-extra'
import Cryptor from '../../Cryptor';
import isValidPath = require('is-valid-path');
import debugLogger from 'debug'

const debug = debugLogger('decrypt');

// TODO: have a separate file for constants
const SALT_SIZE = 16 // in bytes
const IV_SIZE = 16 // in bytes
const CIPHERTEXT_OFFSET = SALT_SIZE + IV_SIZE

export default class CryptoDecrypt extends Command {
  static description = 'Convenience utility for symmetric or asymmetric decryption of data'

  // TODO: examples
/*   static examples = [
    'polykey crypto:encrypt ./file',
    'polykey crypto:encrypt --password=./pass ./file',
    'polykey crypto:encrypt ./file public-key-id',
    'polykey crypto:encrypt ./file public-key-id public-key-id'
  ] */

  static flags = {
    help: flags.help({char: 'h'}),
    output: flags.string({
      char: 'c',
      description: 'Path to output encrypted contents, defaults to STDOUT',
    }),
    password: flags.string({
      char: 'p',
      description: 'Password from which an encryption key will be generated from',
    })
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(CryptoDecrypt)

    let password;
    if (flags.password) {
      password = flags.password;
    } else {
      password = await cli.prompt('What is your password?', {type: 'hide'})
    }
    const fileBuf = await fs.readFile(args.file)
    const salt = fileBuf.slice(0, SALT_SIZE)
    debug(`salt: ${salt.toString('hex')}`)
    const iv = fileBuf.slice(SALT_SIZE, SALT_SIZE + IV_SIZE)
    debug(`iv: ${iv.toString('hex')}`)
    const ciphertext = fileBuf.slice(CIPHERTEXT_OFFSET);
    const key = Cryptor.pbkdfSync(password, salt)
    debug(`key: ${key.toString('hex')}`)
    const cryptor = new Cryptor(key, iv);
    // TODO: make async
    const plaintext = cryptor.decryptSync(ciphertext)

    if (flags['output']) { 
      if (!isValidPath(flags['output'])) {
        throw Error("Invalid path: " + flags['output'])
      }

      await fs.writeFile(flags['output'], plaintext)
    } else {
      console.log(plaintext.toString())
    }

  }
}
