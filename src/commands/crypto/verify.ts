import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import Cryptor from '../../Cryptor';
import fs from 'fs-extra'

export default class CryptoVerify extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    output: flags.string({
      char: 'o',
      description: 'Path to output signed contents, defaults to STDOUT'
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
    const {args, flags} = this.parse(CryptoVerify)

    const fileBuf = await fs.readFile(args.file)
    const keyBuf = await fs.readFile(args.key)

    const cryptor = new Cryptor()
    await cryptor.loadPublicKey(keyBuf.toString())

    const valid = await cryptor.verifyData(fileBuf)

    if (valid) {
      console.log('Good Signature')
    } else {
      console.log('Bad signature')
    }
  }
}
