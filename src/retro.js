import { createBrailleInstructions } from "./createBrailleInstructions.js";
import { brailleTable } from "./brailleTable.js";

(function extendDotsObject() {
  console.log("extendDotsObject");

  dots = dots || {};

  dots.is6DotsImage = () => document.getElementById("6-dots-radio").checked;

  dots.onClickCreateBrailleInstructions = () => {
    console.log("click - onClickCreateBrailleInstructions");
    const brailleInstructionObj = createBrailleInstructions(
      document.getElementById("txt").value
    );

    document.getElementById(
      "txt-braille-instructions"
    ).value = brailleInstructionObj.instructions.join("");

    document.getElementById(
      "txt-braille-instructions"
    ).value += `\n\nMax line length: Row ${brailleInstructionObj.maxRow}, ${brailleInstructionObj.maxLineLength} characters.`;
  };
})();

(function initInputValues() {
  console.log("initInputValues");
  // set Width and Height
  document.getElementById("widt").value = 40;
  document.getElementById("heig").value = 50;

  // set Brightness slider
  document.getElementById("fuzzw").value = 30;

  // add 6-dot braille table on screen
  var brailleHTMLTable = document.getElementById("braille-table");
  let rowCount = 0;
  let newRow = brailleHTMLTable.insertRow(0);
  let columnCount = -1;
  brailleTable.forEach((brailleItem, index) => {
    console.log(brailleItem.brailleForm);
    if (index % 8 === 0) {
      rowCount += 1;
      newRow = brailleHTMLTable.insertRow(rowCount);
      columnCount = -1;
    }
    columnCount += 1;
    let cell = newRow.insertCell(columnCount);
    cell.innerHTML = brailleItem.brailleForm;
    cell.className = "braille-table-cells";
  });
})();
