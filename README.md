# @fullstackcraft/codevideo-ide

A fully event-sourced IDE for codevideo. Reconstitute a snapshot of the entire IDE at any point in time in a software project.

## Usage

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