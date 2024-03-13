import * as Config from "./config";
import * as Env from "./env";

declare global {
  var memoizedStartup: { env: Env.Env; config: Config.Config } | undefined;
}

const gracefulShutdown = () => {
  globalThis.memoizedStartup?.env?.sql?.close();
  delete globalThis.memoizedStartup;
};

export const load = async () => {
  if (globalThis.memoizedStartup === undefined) {
    const config = Config.make();
    if (config.ok) {
      globalThis.memoizedStartup = {
        config: config.value,
        env: await Env.make(config.value),
      };

      if (process.env.NEXT_MANUAL_SIG_HANDLE) {
        process.on("SIGTERM", () => {
          console.log("Shutting down...");
          gracefulShutdown();
          process.exit(0);
        });
        process.on("SIGINT", () => {
          console.log("Shutting down...");
          gracefulShutdown();
          process.exit(0);
        });
      }
    } else {
      throw config.error;
    }
  }
  return globalThis.memoizedStartup;
};
