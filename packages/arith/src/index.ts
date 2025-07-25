// Repl loop

// import * as readline from "readline";
export { parse, print, type Term } from "./ast";
export { evaluate, evaluate1, isValue } from "./eval";

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: "> ",
// });

// rl.prompt();

// rl.on("line", (line) => {
//   try {
//     const term = parse(line.trim());
//     const result = evaluate(term);
//     console.log(print(result));
//   } catch (err) {
//     console.error("Error");
//   }
//   rl.prompt();
// }).on("close", () => {
//   console.log("Exiting REPL.");
//   process.exit(0);
// });
