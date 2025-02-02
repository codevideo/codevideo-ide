# @fullstackcraft/codevideo-ide

A fully event-sourced IDE for codevideo. Reconstitute a snapshot of the entire IDE at any point in time in a software project.

## Usage

Install peer dependencies:

```shell
npm install @fullstackcraft/codevideo-mouse @fullstackcraft/codevideo-types @fullstackcraft/codevideo-virtual-ide @fullstackcraft/codevideo-virtual-editor monaco-editor monaco-themes @monaco-editor/react
```

You'll also need to install tailwind. Here a link to their official docs for create-react-app, but if you are using Next.js, Remix, or others, the configuration will be different: https://v3.tailwindcss.com/docs/guides/create-react-app

Install:

```shell
npm install @fullstackcraft/codevideo-ide
```

Use it in your react app:

```tsx
import { IDE } from '@fullstackcraft/codevideo-ide';

function App() {
  return (
    <IDE />
  );
}
```