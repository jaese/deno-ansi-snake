import { key_reader, printf, sleep } from "./deps.ts";

import * as term from "./term/mod.ts";

import { newApp } from "./app.ts";

const main = async (): Promise<void> => {
  term.hideCursor();

  try {
    const app = newApp();
    handleKeypresses(app);

    while (!app.finished) {
      term.clearScreen();
      app.update();
      app.draw();

      await sleep(0.2);
    }
  } finally {
    term.showCursor();
  }

  printf("\nBye!\n");
  Deno.exit(0);
};

const handleKeypresses = async (app) => {
  for await (const keyPresses of key_reader.readKeypresses(Deno.stdin)) {
    for (const keyPress of keyPresses) {
      app.onKeypress(keyPress.key);
    }
  }
};

if (import.meta.main) {
  await main();
}
