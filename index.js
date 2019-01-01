const chalk = require("chalk");
const isBrowser = typeof window === "object";

function formatStyledMessageComponent({ bold, underline, color, string }) {
  const style = [
    bold && "bold",
    underline && "underline",
    color && color.toLowerCase()
  ]
    .filter(Boolean)
    .join(".");

  return style.length ? chalk[style](string) : string;
}

function formatMessage(message) {
  return message.reduceRight(
    (acc, a) =>
      (typeof a === "object" ? formatStyledMessageComponent(a) : a) + acc
  );
}

function formatCompilationErrors(errors) {
  return errors.reduceRight((acc, curr, i, arr) => {
    const formattedError = curr.problems
      .map(
        ({ title, message }) =>
          `${chalk.cyan(createTitleLine(title, curr.path))}\n\n${formatMessage(
            message
          )}`
      )
      .join("\n\n");
    return acc
      ? `${acc}\n\n${chalk.red(
          createSignPost(arr[i + 1].name, curr.name)
        )}\n\n\n${formattedError}`
      : formattedError;
  }, null);
}

/*
Returns a and b formatted as a horizontal mutliline signpost such as this:
```
                                                             src/Main.elm  ↑
====o======================================================================o====
    ↓  src/Yolo.elm
```
@param {string} a
@param {string} b
@returns {string}
*/
function createSignPost(a, b) {
  const lengthOfLine = Math.max(Math.max(a.length, b.length) + 7, 80);
  return [
    `${a.padStart(lengthOfLine - 7, " ")}  ↑`,
    `${"====o".padEnd(lengthOfLine - 5, "=")}o====`,
    `    ↓  ${b}`
  ].join("\n");
}

/*
Returns the title line composed of the name of the error and the file path
```
-- NAMING ERROR --------------------------------------------------- src/Main.elm
```
@param {string} title
@param {string} path
@returns {string}
*/
function createTitleLine(title, path) {
  const formattedTitle = `-- ${title} --`;
  return `${formattedTitle}${` ${path}`.padStart(
    80 - formattedTitle.length,
    "-"
  )}`;
}

function findElmError(errors) {
  if (errors.length === 0) {
    return null;
  }
  return errors[0].startsWith(`{"type":"compile-errors"`)
    ? errors[0]
    : findElmError(errors.slice(1));
}

module.exports = function(errorString) {
  const elmError = findElmError(errorString.split("\n"));
  try {
    return formatCompilationErrors(JSON.parse(elmError).errors);
  } catch (error) {
    return error;
  }
};
