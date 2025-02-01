import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

export default [
  // standard package
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
    },
    plugins: [typescript()],
    external: [
      "@fullstackcraftllc/codevideo-types",
      "@fullstackcraftllc/codevideo-virtual-ide",
      "@fullstackcraftllc/codevideo-mouse",
      "react",
      "react/jsx-runtime",
      "@xterm/xterm",
      "xterm/css/xterm.css",
      "@monaco-editor/react",
      "re-resizable",
      "monaco-editor",
      "monaco-themes/themes/Monokai.json"
    ]
  },
  // type declarations
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "es",
      },
    ],
    plugins: [
      dts(),
    ],
    external: [
      "@fullstackcraftllc/codevideo-types",
      "@fullstackcraftllc/codevideo-virtual-ide",
      "@fullstackcraftllc/codevideo-mouse",
      "react",
      "react/jsx-runtime",
      "@xterm/xterm",
      "xterm/css/xterm.css",
      "@monaco-editor/react",
      "re-resizable",
      "monaco-editor",
      "monaco-themes/themes/Monokai.json"
    ]
  },
];