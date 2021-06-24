
import { PolykeyAgent } from '@matrixai/polykey/src';

async function main() {
  const agent = new PolykeyAgent();
  await agent.start({ password: "Password" })
}

main();
