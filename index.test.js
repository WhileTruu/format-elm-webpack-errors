const chalk = require("chalk");

const formatElmWebpackErrors = require(".");

// Test setup

const elmError = {
  type: "compile-errors",
  errors: [
    {
      path: "src/Common/Types/Product.elm",
      name: "Common.Types.Product",
      problems: [
        {
          title: "NAMING ERROR",
          region: {
            start: { line: 12, column: 23 },
            end: { line: 12, column: 30 }
          },
          message: [
            "I cannot find a `Stringx` type:\n\n12|     , descriptionEN : Stringx\n                          ",
            {
              bold: false,
              underline: false,
              color: "red",
              string: "^^^^^^^"
            },
            "\nThese names seem close though:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "String"
            },
            "\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "Int"
            },
            "\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "Sub.Sub"
            },
            "\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "List"
            },
            "\n\n",
            {
              bold: false,
              underline: true,
              color: null,
              string: "Hint"
            },
            ": Read <https://elm-lang.org/0.19.0/imports> to see how `import`\ndeclarations work in Elm."
          ]
        }
      ]
    },
    {
      path: "src/Common/Types/Language.elm",
      name: "Common.Types.Language",
      problems: [
        {
          title: "TYPE MISMATCH",
          region: {
            start: { line: 34, column: 71 },
            end: { line: 34, column: 78 }
          },
          message: [
            'The (++) operator cannot append these two values:\n\n34|                         Json.Decode.fail ("Unrecognized language " ++ [] >> s)\n                                              ',
            {
              bold: false,
              underline: false,
              color: "red",
              string: "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
            },
            "\nI already figured out that the left side of (++) is:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "String"
            },
            "\n\nBut this clashes with the right side, which is:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "a -> c"
            },
            ""
          ]
        },
        {
          title: "TYPE MISMATCH",
          region: {
            start: { line: 34, column: 77 },
            end: { line: 34, column: 78 }
          },
          message: [
            'The right argument of (>>) is causing problems.\n\n34|                         Json.Decode.fail ("Unrecognized language " ++ [] >> s)\n                                                                                ',
            {
              bold: false,
              underline: false,
              color: "red",
              string: "^"
            },
            "\nThis `s` value is a:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "String"
            },
            "\n\nBut (>>) needs the right argument to be:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "b -> c"
            },
            "\n\n",
            {
              bold: false,
              underline: true,
              color: null,
              string: "Hint"
            },
            ": With operators like (>>) I always check the left side first. If it seems\nfine, I assume it is correct and check the right side. So the problem may be in\nhow the left and right arguments interact!"
          ]
        },
        {
          title: "TYPE MISMATCH",
          region: {
            start: { line: 34, column: 71 },
            end: { line: 34, column: 73 }
          },
          message: [
            'The left argument of (>>) is causing problems:\n\n34|                         Json.Decode.fail ("Unrecognized language " ++ [] >> s)\n                                                                          ',
            {
              bold: false,
              underline: false,
              color: "red",
              string: "^^"
            },
            "\nThe left argument is a list of type:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "List a"
            },
            "\n\nBut (>>) needs the left argument to be:\n\n    ",
            {
              bold: false,
              underline: false,
              color: "yellow",
              string: "a -> b"
            },
            ""
          ]
        }
      ]
    }
  ]
};

const error = [
  "./src/Main.elm",
  "Module build failed (from ./node_modules/elm-webpack-loader/index.js):",
  "Error: Compiler process exited with error Compilation failed",
  JSON.stringify(elmError),
  "    at ChildProcess.<anonymous> (/Users/truu/Code/salmefelt/frontend/node_modules/node-elm-compiler/index.js:149:27)",
  "    at emitTwo (events.js:126:13)",
  "    at ChildProcess.emit (events.js:214:7)",
  "    at maybeClose (internal/child_process.js:925:16)",
  "    at Socket.stream.socket.on (internal/child_process.js:346:11)",
  "    at emitOne (events.js:116:13)",
  "    at Socket.emit (events.js:211:7)",
  "    at Pipe._handle.close [as _onclose] (net.js:554:12)"
].join("\n");

const expectation = `${chalk.cyan(
  "-- TYPE MISMATCH --------------------------------- src/Common/Types/Language.elm"
)}

The (++) operator cannot append these two values:

34|                         Json.Decode.fail ("Unrecognized language " ++ [] >> s)
                                              ${chalk.red(
                                                "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
                                              )}
I already figured out that the left side of (++) is:

    ${chalk.yellow("String")}

But this clashes with the right side, which is:

    ${chalk.yellow("a -> c")}

${chalk.cyan(
  "-- TYPE MISMATCH --------------------------------- src/Common/Types/Language.elm"
)}

The right argument of (>>) is causing problems.

34|                         Json.Decode.fail ("Unrecognized language " ++ [] >> s)
                                                                                ${chalk.red(
                                                                                  "^"
                                                                                )}
This \`s\` value is a:

    ${chalk.yellow("String")}

But (>>) needs the right argument to be:

    ${chalk.yellow("b -> c")}

${chalk.underline(
  "Hint"
)}: With operators like (>>) I always check the left side first. If it seems
fine, I assume it is correct and check the right side. So the problem may be in
how the left and right arguments interact!

${chalk.cyan(
  "-- TYPE MISMATCH --------------------------------- src/Common/Types/Language.elm"
)}

The left argument of (>>) is causing problems:

34|                         Json.Decode.fail ("Unrecognized language " ++ [] >> s)
                                                                          ${chalk.red(
                                                                            "^^"
                                                                          )}
The left argument is a list of type:

    ${chalk.yellow("List a")}

But (>>) needs the left argument to be:

    ${chalk.yellow("a -> b")}

${chalk.red(`                                                    Common.Types.Language  ↑
====o======================================================================o====
    ↓  Common.Types.Product`)}


${chalk.cyan(
  "-- NAMING ERROR ----------------------------------- src/Common/Types/Product.elm"
)}

I cannot find a \`Stringx\` type:

12|     , descriptionEN : Stringx
                          ${chalk.red("^^^^^^^")}
These names seem close though:

    ${chalk.yellow("String")}
    ${chalk.yellow("Int")}
    ${chalk.yellow("Sub.Sub")}
    ${chalk.yellow("List")}

${chalk.underline(
  "Hint"
)}: Read <https://elm-lang.org/0.19.0/imports> to see how \`import\`
declarations work in Elm.`;

// Test

test("formats elm errors as expected", () => {
  expect(formatElmWebpackErrors(error)).toBe(expectation);
});
