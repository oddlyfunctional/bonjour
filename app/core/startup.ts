import * as Config from "./config";
import * as Env from "./env";

let memo: { env: Env.Env; config: Config.Config } | undefined;
export const load = async () => {
  if (memo === undefined) {
    const config = Config.make();
    if (config.ok) {
      memo = {
        config: config.value,
        env: await Env.make(config.value),
      };
    } else {
      throw config.error;
    }
  }
  return memo;
};
