

> Learn how to use instrumentation to run code at server startup in your Next.js app


If you export a function named `register` from this file, we will call that function whenever a new Next.js server instance is bootstrapped. 

When your `register` function is deployed, it will be called on each cold boot (but exactly once in each environment).

Sometimes, it may be useful to import a file in your code because of the side effects it will cause. For example, you might import a file that defines a set of global variables, but never explicitly use the imported file in your code. You would still have access to the global variables the package has declared!.

You can import files with side effects in `instrumentation.ts`, which you might want to use in your `register` function as demonstrated in the following example:

```
import { init } from 'package-init';
 
export function register() {
  init();
}
```

However, we recommend importing files with side effects using `import` from within your `register` function instead. 

```
export async function register() {
  await import('package-with-side-effect');
}
```


We call `register` in all environments, so it's necessary to conditionally import any code that doesn't support both `edge` and `nodejs`. You can use the environment variable `NEXT_RUNTIME` to get the current environment. Importing an environment-specific code would look like this:

```
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node');
  }
 
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation-edge');
  }
}
```