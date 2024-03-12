import * as Config from "./config";
import * as Env from "./env";

let env: Env.Env | undefined;
export const start = async () => {
  if (env === undefined) {
    const config = Config.make();
    if (config.ok) {
      env = await Env.make(config.value);
    } else {
      throw config.error;
    }
  }
  return env;
};
