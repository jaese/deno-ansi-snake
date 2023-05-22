import { printf } from "./deps.ts";

import * as vec2 from "./vec2/mod.ts";
import * as term from "./term/mod.ts";

const screenWidth = 25;
const screenHeight = 20;

export interface App {
  update(): void;
  draw(): void;
  onKeypress(key: string): void;

  finished: boolean;
}

export const newApp = (): App => {
  const game = newGame();

  const app = {
    state: AppState.Start,

    game: game,
    finished: false,

    update() {
      if (this.state === AppState.Playing) {
        this.game.update();
        if (this.game.dead) {
          this.state = AppState.Dead;
        }
      }
    },

    onKeypress(key: string) {
      if (key === "q") {
        this.finished = true;
        return;
      }
      if (this.state === AppState.Start) {
        // Transition on any key.
        this.state = AppState.Playing;
      } else if (this.state === AppState.Playing) {
        this.game.onKeypress(key);
      } else if (this.state === AppState.Dead) {
        // Transition on any key.
        this.state = AppState.Playing;
        this.game = newGame();
      }
    },

    draw() {
      if (this.state === AppState.Start) {
        drawFrame();
        term.moveCursor(6, 4);
        printf("SNAKE");

        term.moveCursor(8, 4);
        printf("Press Enter to start");
      } else if (this.state === AppState.Playing) {
        this.game.draw();
      } else if (this.state === AppState.Dead) {
        this.game.draw();

        term.moveCursor(6, 4);
        printf("SNAKE is DEAD.");
        term.moveCursor(8, 4);
        printf("Press Enter to restart");
      }

      term.moveCursor(screenHeight + 1, 1);
      printf("Press 'q' to quit");
    },
  };

  return app;
};

const drawFrame = () => {
  term.moveCursor(1, 1);
  for (let j = 0; j < screenWidth; j++) {
    printf("#");
  }

  for (let i = 1; i < screenHeight - 1; i++) {
    term.moveCursor(i + 1, 1);
    printf("#");
    term.moveCursor(i + 1, screenWidth);
    printf("#");
  }

  term.moveCursor(screenHeight, 1);
  for (let j = 0; j < screenWidth; j++) {
    printf("#");
  }
};

enum AppState {
  Start = 0,
  Playing,
  Dead,
}

interface Game {
  update(): void;
  draw(): void;
  onKeypress(key: string): void;
}

const newGame = (): Game => {
  const playgroundWidth = screenWidth - 2;
  const playgroundHeight = screenHeight - 2;

  const randomFruitPosition = (): vec2.T => {
    const p = vec2.make(
      Math.floor(Math.random() * playgroundWidth),
      Math.floor(Math.random() * playgroundHeight),
    );
    return p;
  };

  const fruitPos = randomFruitPosition();

  const body = new Array(3);
  body[0] = vec2.make(2, 0);
  body[1] = vec2.make(1, 0);
  body[2] = vec2.make(0, 0);

  const g = {
    body: body,
    direction: vec2.make(1, 0),

    fruitPos: fruitPos,
    score: 0,

    dead: false,

    update() {
      const nextPos = vec2.make(
        this.body[0].x + this.direction.x,
        this.body[0].y + this.direction.y,
      );

      if (this.isCollided(nextPos)) {
        this.dead = true;
        return;
      }

      const lastPos = this.body[this.body.length - 1];

      for (let i = this.body.length - 1; i > 0; i -= 1) {
        this.body[i] = this.body[i - 1];
      }

      this.body[0] = nextPos;

      if (vec2.equal(nextPos, this.fruitPos)) {
        this.body.push(lastPos);

        this.fruitPos = randomFruitPosition();
        this.score += 1;
      }
    },

    isCollided(p: vec2.T): boolean {
      if (
        p.x < 0 || p.x >= playgroundWidth || p.y < 0 ||
        p.y >= playgroundHeight
      ) {
        return true;
      }

      for (let i = 0; i < this.body.length; i++) {
        if (vec2.equal(this.body[i], p)) {
          return true;
        }
      }

      return false;
    },

    draw() {
      drawFrame();

      for (let i = 0; i < this.body.length; i++) {
        const p = this.body[i];
        const termPos = pointToTerminalPos(p);
        term.moveCursor(termPos[0], termPos[1]);
        if (i === 0) {
          printf("O");
        } else {
          printf("o");
        }
      }

      if (this.fruitPos !== null) {
        const termPos = pointToTerminalPos(this.fruitPos);
        term.moveCursor(termPos[0], termPos[1]);
        printf(FRUIT_CHAR);
      }

      term.moveCursor(8, screenWidth + 4);
      printf("Score: %d", this.score);
    },

    onKeypress(key: string) {
      let nextDir = null;
      if (key === "up") {
        nextDir = vec2.make(0, -1);
      } else if (key === "down") {
        nextDir = vec2.make(0, 1);
      } else if (key === "right") {
        nextDir = vec2.make(1, 0);
      } else if (key === "left") {
        nextDir = vec2.make(-1, 0);
      }

      if (nextDir !== null) {
        if (!vec2.equal(vec2.scale(-1, this.direction), nextDir)) {
          this.direction = nextDir;
        }
      }
    },
  };

  return g;
};

const FRUIT_CHAR = "@";

const pointToTerminalPos = (p: vec2.T): number[] => {
  return [p.y + 2, p.x + 2];
};
