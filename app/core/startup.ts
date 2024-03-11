import * as Config from "./config";
import * as Env from "./env";

export const start = async () => {
  const config = Config.make();
  if (config.ok) {
    return await Env.make(config.value);
  } else {
    throw config.error;
  }
};
