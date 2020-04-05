import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import Cryptor from '../../Cryptor';
import fs from 'fs-extra'

export default class CryptoSign extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    output: flags.string({
      char: 'o',
      description: 'Path to output signed contents, defaults to STDOUT'
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
      description: 'file to sign'
    },
    {
      name: 'key',
      required: true,
    }
  ]

  async run() {
    const {args, flags} = this.parse(CryptoSign)

    let password;
    if (flags.password) {
      password = flags.password;
    } else {
      password = await cli.prompt('What is your password?', {type: 'hide'})
    }

    const fileBuf = await fs.readFile(args.file)
    const keyBuf = await fs.readFile(args.key)

    const cryptor = new Cryptor()

    const key = {key: keyBuf.toString(), passphrase: password}
    const signed = await cryptor.signData(fileBuf, key)

    if (flags.output) {
      await fs.writeFile(flags.output, signed)
    } else {
      console.log(signed)
    }
  }
}
