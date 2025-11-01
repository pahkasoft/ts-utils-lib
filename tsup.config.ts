// tsup.config.ts
import { defineConfig } from 'tsup'
import pkg from './package.json' assert { type: 'json' }

const bannerText = `/* TsUtilsLib v${pkg.version} | (c) 2023 PahkaSoft | Licensed under the MIT License */`;

export default defineConfig([
    {
        entry: ['src/index.ts'],
        outDir: 'dist',
        target: 'es2020',
        format: ['esm', 'cjs'],
        dts: true,
        sourcemap: true,
        clean: true,
        banner: { js: bannerText }
    },
    {
        entry: {
            'index.es5': 'src/index.es5.iife.ts',
            'index.es5.polyfilled': 'src/index.es5.polyfilled.iife.ts'
        },
        outDir: 'dist',
        target: 'es5',
        format: ['iife'],
        globalName: 'TsUtilsLib',
        sourcemap: true,
        banner: { js: bannerText },
        minify: true,
        outExtension: () => ({ js: '.iife.js' })
    },
]);
