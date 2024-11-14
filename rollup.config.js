import terser from "@rollup/plugin-terser"

export default [
    {
        input: 'src/index.js',
        output: [{
            file: 'dist/grove.esm.js',
            format: 'es',
            sourcemap: true
        }],
        plugins: [
            terser()
        ]
    },
    {
        input: 'src/index.js',
        output: [{
            file: 'dist/grove.js',
            format: 'cjs',
            sourcemap: true
        }],
        plugins: [
            terser()
        ]
    }
];
