import net from 'net';
import protobuf from 'protobufjs';
import { ipcMain } from 'electron';
const PolykeyAgent = require('js-polykey').PolykeyAgent;

async function startModel() {
  const pid = await PolykeyAgent.startAgent();
  console.log(`Agent started with pid: ${pid}`);

  ipcMain.on('polykey-agent', async (event, args) => {

    try {
      // Its a call to the polykey agent, so need to first make sure its running
      const client = PolykeyAgent.connectToAgent(() => {
        const socket = net.createConnection(PolykeyAgent.SocketPath)
        return socket
      })
      // If agent has stopped, start it again
      if (await client.getAgentStatus() != 'online') {
        const pid = await PolykeyAgent.startAgent();
        console.log(`Agent started with pid: ${pid}`);
      }

      const message = protobuf.util.newBuffer(protobuf.util.base64.length(args))
      protobuf.util.base64.decode(args, message, 0)

      const response = (await client.sendRequestToAgent(message))[0]

      const encodedResponse = protobuf.util.base64.encode(response, 0, response.length)

      event.reply('polykey-agent', encodedResponse)
    } catch (error) {
      console.log(error);
    }
  })
}

export default startModel
