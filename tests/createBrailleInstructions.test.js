import { expect } from "chai";
import { createBrailleInstructions } from "../src/createBrailleInstructions.js";

describe("createBrailleInstructions", function () {
  describe("with one row", function () {
    describe("should handle repeated characters", function () {
      it("when repeats are the first characters in the line", function () {
        const result = createBrailleInstructions("⠁⠁");
        expect(result.instructions[0]).to.equal("Row 01: a[2 times]\n");
        expect(result.maxLineLength).to.equal(2);
      });

      it("when repeats are in the last part of line", function () {
        const result = createBrailleInstructions("⠃⠁⠁");
        expect(result.instructions[0]).to.equal("Row 01: b, a[2 times]\n");
        expect(result.maxLineLength).to.equal(3);
      });

      it("when more than 2 repeats in the middle of sentence", function () {
        const result = createBrailleInstructions("⠃⠁⠁⠁⠁⠁⠁⠃");
        expect(result.instructions[0]).to.equal("Row 01: b, a[6 times], b\n");
        expect(result.maxLineLength).to.equal(8);
      });

      it("when repeats are in the middle of line", function () {
        const result = createBrailleInstructions("⠃⠁⠁⠃");
        expect(result.instructions[0]).to.equal("Row 01: b, a[2 times], b\n");
        expect(result.maxLineLength).to.equal(4);
      });
    });

    it("should handle only one character in row", function () {
      const result = createBrailleInstructions("⠁");
      expect(result.instructions[0]).to.equal("Row 01: a\n");
      expect(result.maxLineLength).to.equal(1);
    });
  });

  describe("with multiple rows", function () {
    it("should handle rows and repeats", function () {
      const result = createBrailleInstructions("⠃⠁⠁⠁⠁⠁⠁⠃\n⠁⠁\n⠃⠁");
      expect(result.instructions[0]).to.equal("Row 01: b, a[6 times], b\n");
      expect(result.instructions[1]).to.equal("Row 02: a[2 times]\n");
      expect(result.instructions[2]).to.equal("Row 03: b, a\n");
      expect(result.maxLineLength).to.equal(8);
      expect(result.maxRow).to.equal(1);
    });

    it("should handle ascii 32 and convert to unicodeDecimal 10240 (braille space)", function () {
      const testValue = `   `;
      const result = createBrailleInstructions(testValue);
      expect(result.instructions[0]).to.equal("Row 01: (space)[3 times]\n");
    });

    it("should output error when no match on braille table", function () {
      const testValue = "⠃."; // period is ascii 46, it is not braille so expect error
      const result = createBrailleInstructions(testValue);
      expect(result.error).to.contain(
        "Could not find braille match for '.'; change character 2 in Row 1: '⠃.';"
      );
    });
  });
});
