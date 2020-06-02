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

    document.getElementById("txt-braille-instructions").value =
      (brailleInstructionObj.error &&
        brailleInstructionObj.error +
          "\n" +
          brailleInstructionObj.instructions.join("")) ||
      brailleInstructionObj.instructions.join("");

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
  document.getElementById("brightness-value").innerHTML = 30;
  document.getElementById("fuzzw").onchange = (evt) => {
    document.getElementById("brightness-value").innerHTML =
      evt.srcElement.value;
  };

  // add 6-dot braille table on screen
  var brailleHTMLTable = document.getElementById("braille-table");
  let rowCount = 0;
  let newRow = brailleHTMLTable.insertRow(0);
  let columnCount = -1;

  const copyToClipboard = (brailleStr) => {
    console.log(`copyToClipboard ${brailleStr}`);
    let el = document.createElement("textarea");
    el.value = brailleStr;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    el = null;
  };

  brailleTable.forEach((brailleItem, index) => {
    if (index % 8 === 0) {
      rowCount += 1;
      newRow = brailleHTMLTable.insertRow(rowCount);
      columnCount = -1;
    }
    columnCount += 1;
    let cell = newRow.insertCell(columnCount);
    cell.innerHTML = brailleItem.brailleForm;
    cell.onclick = () => copyToClipboard(cell.innerHTML);
    cell.className = "braille-table-cells";
  });
})();
