import { resolve } from '../../constants';

export const sassExtract = () => ({
  module: {
    rules: [
      {
        test: /.*\.{0,1}vars.scss$/,
        loader: resolve('sass-extract-loader'),
      }
    ]
  }
});
