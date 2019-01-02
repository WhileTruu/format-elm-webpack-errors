# format-elm-webpack-errors

> Colours and formats elm compiler error messages in json format it finds in webpack errors.

Elm compiler errors are easy to understand and useful (https://elm-lang.org/blog/compiler-errors-for-humans). However, `elm make` outputs uncoloured error messages when stdout is not a terminal (https://github.com/elm-community/elm-webpack-loader/issues/94) and this looks ugly, makes longer error messages harder to navigate and understand at a glance and clutters them with useless internal stacks.

## Install

```bash
npm install @whiletruu/format-elm-webpack-errors --save-dev
```

## Usage

Report elm compiler errors as json.

```js
{
  loader: require.resolve("elm-webpack-loader"),
  options: { report: "json" }
}
```

Create a webpack compiler for WebpackDevServer

```js
const webpack = require("webpack");
const formatElmCompilerError = require("@whiletruu/format-elm-webpack-errors");

const compiler = webpack(/* config */);

function isElmCompilerError(error) {
  return error.startsWith("./src/Main.elm");
}

compiler.hooks.invalid.tap("invalid", function() {
  console.log("Compiling...");
});

compiler.hooks.done.tap("done", stats => {
  const { warnings, errors } = stats.toJson({
    all: false,
    warnings: true,
    errors: true
  });

  const messages = {
    warnings,
    errors: errors.reduce((accumulator, error) => {
      if (isElmCompilerError(error)) {
        return accumulator.concat([formatElmCompilerError(error)]);
      }
      return accumulator;
    }, [])
  };

  if (!messages.errors.length && !messages.warnings.length) {
    console.log(chalk.green("Compiled successfully!"));
  }

  if (messages.errors.length) {
    console.log(chalk.red("Failed to compile.\n"));
    console.log(messages.errors.join("\n\n"));
    return;
  }

  if (messages.warnings.length) {
    console.log(chalk.yellow("Compiled with warnings.\n"));
    console.log(messages.warnings.join("\n\n"));
  }
});
```

WebpackDevServer has it's own messages by default, but now we're emitting ours
by listening to the compiler events with `compiler.hooks[...].tap`.
To not get the same errors several times in different formats,
WebpackDevServer should be told to be quiet in it's config.

```js
{
  quiet: true;
}
```
