import * as path from "path";

const ROOT: string = path.resolve(__dirname, "../../..");

const root = (dir: string = ""): string => path.join(ROOT, dir);

const appTitle: string = "React App";

export {root, appTitle};
