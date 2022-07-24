import { PolykeyAgent, PolykeyClient } from '@matrixai/polykey/dist';
import Logger, { LogLevel, StreamHandler } from '@matrixai/logger';

const nodePath = 'tmp/keynode';

async function main() {
  const agent = new PolykeyAgent({
    nodePath
  });
  await agent.start({ password: 'password' });
  // Start a session.

  const clientConfig = {};
  clientConfig['logger'] = new Logger('CLI Logger', LogLevel.WARN, [
    new StreamHandler(),
  ]);
  clientConfig['logger'].setLevel(LogLevel.DEBUG);
  clientConfig['nodePath'] = nodePath;

  // Temp so we can check it started properly before using it.
  // const tmpClient = new PolykeyClient(clientConfig);
  // await tmpClient.start({});

  // const grpcClient = tmpClient.grpcClient;
  // await grpcClient.vaultsList();
}

main();
