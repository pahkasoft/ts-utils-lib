// tsup.config.ts
import { defineConfig, Format, Options } from 'tsup'
import pkg from './package.json' assert { type: 'json' }

const ConfigEntries: { entry: Record<string, string>, format: Format }[] = [
    { entry: { 'index': 'src/index.ts' }, format: 'esm' },
    { entry: { 'index': 'src/index.ts' }, format: 'cjs' },
    { entry: { 'index.es5': 'src/index.es5.iife.ts' }, format: 'iife' },
    { entry: { 'index.es5.polyfilled': 'src/index.es5.polyfilled.iife.ts' }, format: 'iife' }
];

const ConfigOptions = ConfigEntries.map((config, configId) => {
    const { entry, format } = config;
    const bannerText = `/*!
 * TsUtilsLib v${pkg.version} (${format})
 * (c) 2023–${new Date().getFullYear()} PahkaSoft
 * Licensed under the MIT License
 */`;
    const libInfo = `TsUtilsLib v${pkg.version} (${format})`;
    const isIIFE = format === 'iife';
    return {
        entry,
        outDir: 'dist',
        target: isIIFE ? 'es5' : 'es2020',
        format,
        treeshake: !isIIFE,
        globalName: isIIFE ? 'TsUtilsLib' : undefined,
        sourcemap: !isIIFE,
        dts: !isIIFE,
        clean: configId === 0,
        minify: isIIFE,
        outExtension: () => ({ js: isIIFE ? '.iife.js' : undefined }),
        banner: { js: bannerText },
        define: { __LIB_INFO__: JSON.stringify(libInfo) }
    }
});

export default defineConfig(ConfigOptions);
