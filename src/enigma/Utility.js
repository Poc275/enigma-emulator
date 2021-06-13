class Utility {

    static getCharacterCode(letter) {
        // minus 65 as this is the ASCII code for "A"
        return letter.charCodeAt(0) - 65;
    }

    static getCharacterFromCode(code) {
        return String.fromCharCode(code);
    }

    static getShiftedLetter(letter, shift) {
        const charCode = this.getCharacterCode(letter);
        const shiftedCharCode = this.getModulo(charCode + shift, 26);
        return this.getCharacterFromCode(shiftedCharCode + 65);
    }

    static getModulo(val, modulus) {
        // Note that while in most languages, ‘%’ is a remainder operator, in some (e.g. Python, Perl) it is a modulo operator. For positive values, 
        // the two are equivalent, but when the dividend and divisor are of different signs, they give different results. To obtain a modulo in 
        // JavaScript, in place of a % n, use ((a % n ) + n ) % n.
        return ((val % modulus) + modulus) % modulus;
    }
}

export default Utility;