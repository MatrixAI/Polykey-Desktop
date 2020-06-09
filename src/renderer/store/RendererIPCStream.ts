import protobuf from 'protobufjs';
import { Duplex, DuplexOptions } from 'stream';
const ipcRenderer = window.require("electron").ipcRenderer;

class RendererIPCStream extends Duplex {
  channel!: string

  constructor(channel: string, streamOpts: DuplexOptions) {
    streamOpts = streamOpts || {}
    streamOpts.objectMode = streamOpts.objectMode ? streamOpts.objectMode : true
    super(streamOpts)

    this.channel = channel

    const ipcCallback = (event, data) => {
      const buffer = protobuf.util.newBuffer(protobuf.util.base64.length(data))
      protobuf.util.base64.decode(data, buffer, 0)

      this.push(buffer)
    }
    ipcRenderer.on(this.channel, ipcCallback)

    this.on('end', () => {
      ipcRenderer.send(this.channel + '-finish')
      ipcRenderer.removeListener(this.channel, ipcCallback)
    })
    ipcRenderer.once(this.channel + '-finish', () => this.push(null))
  }
}

RendererIPCStream.prototype._read = function () { }

RendererIPCStream.prototype._write = function (data, enc, next) {
  data = protobuf.util.base64.encode(data, 0, data.length)

  ipcRenderer.send(this.channel, data)
  next()
}

export default RendererIPCStream
