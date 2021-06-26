/**
 * Utility/helper functions.
 */
class Utility {

    /**
     * Gets the zero-indexed ASCII character code (A = 0, B = 1 etc.).
     * @param {string} letter - Letter to get the code for
     * @returns {number} ASCII character code
     */
    static getCharacterCode(letter) {
        // minus 65 as this is the ASCII code for "A"
        return letter.charCodeAt(0) - 65;
    }

    /**
     * Converts an ASCII character code to a character.
     * @param {number} code - ASCII character code
     * @returns {string} ASCII character
     */
    static getCharacterFromCode(code) {
        return String.fromCharCode(code);
    }

    /**
     * Gets a letter shifted by a specified number of shifts.
     * @param {string} letter - Letter to shift
     * @param {number} shift - Number of shifts, negative shifts supported
     * @returns {string} Letter shifted by the specified number of shifts
     */
    static getShiftedLetter(letter, shift) {
        const charCode = this.getCharacterCode(letter);
        const shiftedCharCode = this.getModulo(charCode + shift, 26);
        return this.getCharacterFromCode(shiftedCharCode + 65);
    }

    /**
     * Calculates the modulo.
     * @param {number} val - Value to calculate the modulo for
     * @param {number} modulus - Modulus
     * @returns {number} Modulo
     */
    static getModulo(val, modulus) {
        // Note that while in most languages, ‘%’ is a remainder operator, in some (e.g. Python, Perl) it is a modulo operator. For positive values, 
        // the two are equivalent, but when the dividend and divisor are of different signs, they give different results. To obtain a modulo in 
        // JavaScript, in place of a % n, use ((a % n ) + n ) % n.
        return ((val % modulus) + modulus) % modulus;
    }

    /**
     * Calculates the offset between two letters.
     * @param {string} inPos - starting letter
     * @param {string} outPos - ending letter
     * @returns {number} Offset between the two letters
     */
    static getRelativeOffset(inPos, outPos) {
        const inCharCode = Utility.getCharacterCode(inPos);
        const outCharCode = Utility.getCharacterCode(outPos);

        if(inCharCode > outCharCode) {
            // wrap around to get back to outPos
            return (26 - inCharCode) + outCharCode;
        } else {
            return outCharCode - inCharCode;
        }
    }
}

export default Utility;