declare module "postcss-preset-env" {
  interface IOptions {
    stage: number | boolean;
    features: any | boolean;
    browsers: any;
    insertBefore: any;
    insertAfter: any;
    autoprefixer: any;
    preserve: boolean;
    importFrom: string;
    exportTo: string;
  }

  interface IPresetEnv {
    (opts?: IOptions): NodeJS.ReadWriteStream;
  }

  const presetEnv: IPresetEnv;
  export = presetEnv;
}
