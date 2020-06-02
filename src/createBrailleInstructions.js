import { brailleTable } from "./brailleTable.js";

export const createBrailleInstructions = (braillePatternString) => {
  let maxLine = 0;
  let maxRow = 0;
  let rows = [];
  let err = null;

  if (braillePatternString) {
    // replace spaces(ascii 32) with unicodeDecimal: 10240
    braillePatternString = braillePatternString.replace(
      / /g,
      String.fromCharCode(10240)
    );

    console.log("createBrailleInstructions:\n", braillePatternString);

    const lines = braillePatternString.split("\n");
    for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
      let line = lines[rowIndex];
      if (line.length > maxLine) {
        maxLine = line.length;
        maxRow = rowIndex + 1;
      }

      line = "B" + line + "E"; // append 2 known characters to the line =>  B=Begin; E=End

      let rowInstructions = [];
      let repeatRecorded = [];

      if (line.length > 2) {
        // process line
        for (let chrIndex = 1; chrIndex < line.length; chrIndex++) {
          let brailleChar = line[chrIndex];
          let previousBrailleChar = line[chrIndex - 1];

          // find braille character meaning
          const mappedBraille = brailleTable.find(
            (brailleMap) => brailleMap.brailleForm == brailleChar
          );

          if (!mappedBraille) {
            err = {
              instructions: rows,
              maxLineLength: maxLine,
              maxRow: maxRow,
              error: `Error: Could not find braille match for '${brailleChar}'; change character ${chrIndex} in Row ${
                rowIndex + 1
              }: '${line.replace("B", "").replace("E", "")}'; line.charCodeAt(${
                chrIndex - 1
              }): ${line.charCodeAt(chrIndex)}`,
            };
            break;
          }

          if (brailleChar != previousBrailleChar) {
            rowInstructions.push(mappedBraille.meaning);
            repeatRecorded = [];
            repeatRecorded.push(mappedBraille.meaning);
          } else {
            repeatRecorded.push(mappedBraille.meaning);
            // replace last array element as a repeat was detected
            rowInstructions[
              rowInstructions.length - 1
            ] = `${mappedBraille.meaning}[${repeatRecorded.length} times]`;
          }

          if (chrIndex + 1 == line.length - 1) {
            // Done processing - next char will  be 'E', no need to process anymore
            break;
          }
        }

        if (err) {
          if (rowInstructions.length > 0) {
            rows.push(
              `Row ${(rowIndex + 1)
                .toString()
                .padStart(2, "0")}: ${rowInstructions.join(", ")}\n`
            );
          }
          break;
        }
      } else {
        rowInstructions.push("Make new line.");
      }

      rows.push(
        `Row ${(rowIndex + 1)
          .toString()
          .padStart(2, "0")}: ${rowInstructions.join(", ")}\n`
      );
    }
  }

  return (
    err || {
      instructions: rows,
      maxLineLength: maxLine,
      maxRow: maxRow,
      error: null,
    }
  );
};
