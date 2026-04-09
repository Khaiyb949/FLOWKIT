/* eslint-disable @typescript-eslint/no-explicit-any */

// CSS Module declarations for Next.js
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

// SVG asset declarations
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}
