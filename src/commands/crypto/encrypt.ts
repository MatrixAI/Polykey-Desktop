import {Command, flags} from '@oclif/command'
// import Cryptor from '../../../../../lib/Cryptor'
// import Cryptor from '../../../../lib/Cryptor'
import Cryptor from '../../../src/Cryptor'
import fs from 'fs-extra'
import {outputFile} from 'fs-extra'
// import fs, { outputFile } from 'fs-extra'
import chalk from 'chalk'
import cli from 'cli-ux'
import {PathLike} from 'fs-extra'
import isValidPath from 'is-valid-path'
import debugLogger from 'debug'

const debug = debugLogger('encrypt');
  

const SALT_SIZE = 16 // in bytes

export default class Encrypt extends Command {
  static description = 'Convenience utility for symmetric or asymmetric encryption of data'

  static examples = [
    'polykey crypto:encrypt ./file',
    'polykey crypto:encrypt --password=./pass ./file',
    'polykey crypto:encrypt ./file public-key-id',
    'polykey crypto:encrypt ./file public-key-id public-key-id'
  ]

  static flags = {
    help: flags.help({char: 'h'}),
/*     key: flags.string({
      char: 'k',
      name: 'key',
      description: 'Hex encoded symmetric key. User --key-enconding to specify a different encoding',
      exclusive: ['password']
    }), */
/*     'key-path': flags.string({
      char: 'k',
      description: 'Path to symmetric key',
      exclusive: ['password']
    }),
    'key-encoding': flags.string({
      description: 'Encoding for the symmetric key. Ony specify if using --key',
      options: ['hex', 'ascii'],
      dependsOn: ['key']
    }), */
    output: flags.string({
      char: 'c',
      description: 'Path to output encrypted contents, defaults to STDOUT',
    }),
    password: flags.string({
      char: 'p',
      description: 'Password from which an encryption key will be generated from',
    })
  }

  static args = [
    {
      name: 'file',
      required: true,
      description: chalk`Path of the file to encrypt. To write to stdout use  {bold -}  as the filename`
    }
  ]


  async run() {
    const {args, flags} = this.parse(Encrypt)

    let password;
    if (flags['password']) {
      password = flags['password'];
    } else {
      password = await cli.prompt('What is your password?', {type: 'hide'})
    }
    const iv = Cryptor.genRandomIVSync();
    const salt = Cryptor.randomBytes(SALT_SIZE);
    const key = Cryptor.pbkdfSync(password, salt)
    const cryptor = new Cryptor(key, iv);

    debug(`salt: ${salt.toString('hex')}`)
    debug(`iv: ${iv.toString('hex')}`)
    debug(`key: ${key.toString('hex')}`)
    const contents = await fs.readFile(args.file);
    // TODO: make async
    const encryptedContents = cryptor.encryptSync(contents, iv);

    const outputBuf = Buffer.concat([salt, iv, encryptedContents], (salt.length +iv.length + encryptedContents.length));

    if (flags['output']) { 
      if (!isValidPath(flags['output'])) {
        throw Error("Invalid path: " + flags['output'])
      }

      await fs.writeFile(flags['output'], outputBuf)
    } else {
      console.log(outputBuf.toString('base64'))
    }

    
    
    /* 
    The things is that we have a required flag. Either password or key are requried
    We could make only key required, and generating a key piped in 
    */

    console.log(args);

    console.log(flags);

/*     const name = flags.name || 'world'
    this.log(`hello ${name} from /home/aashwin/matrix/js-polykey/polykey-cli/src/commands/encrypt.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    } */
  }
}

// create key based on password, append salt
// Take in key, and encypt file
// STDOUT is deafult