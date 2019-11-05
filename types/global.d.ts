/** Global definitions for development **/

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}