import { createConfig } from '@nx/angular-rspack';

export default createConfig(
  {
    options: {
      root: __dirname,

      outputPath: {
        // Keep build output aligned with the other apps under `dist/apps/*`.
        base: '../../dist/apps/web-admin',
      },
      index: './src/index.html',
      browser: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      inlineStyleLanguage: 'scss',
      assets: [
        {
          glob: '**/*',
          input: './public',
        },
      ],
      styles: ['./src/styles.css'],
      devServer: {
        // Keep a stable default port so `nx run-many --target=serve` works without flags.
        port: 8080,
        // Bind on IPv4 as well; otherwise some clients (or browser settings) may hit IPv4
        // and fail if rspack listens only on ::1.
        host: '0.0.0.0',
      },
    },
  },
  {
    production: {
      options: {
        budgets: [
          {
            type: 'initial',
            maximumWarning: '500kb',
            maximumError: '1mb',
          },
          {
            type: 'anyComponentStyle',
            maximumWarning: '4kb',
            maximumError: '8kb',
          },
        ],
        outputHashing: 'all',
        devServer: {
          port: 8080,
          host: '0.0.0.0',
        },
      },
    },

    development: {
      options: {
        optimization: false,
        vendorChunk: true,
        extractLicenses: false,
        sourceMap: true,
        namedChunks: true,
        devServer: {
          port: 8080,
          host: '0.0.0.0',
        },
      },
    },
  }
);
