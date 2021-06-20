import Utility from "./Utility";

class Reflector {

    constructor() {
        this._reflectorB = new Map([
            ["A", "Y"], ["B", "R"], ["C", "U"], ["D", "H"], ["E", "Q"], ["F", "S"], ["G", "L"], ["H", "D"], ["I", "P"], ["J", "X"], ["K", "N"], ["L", "G"], ["M", "O"], 
            ["N", "K"], ["O", "M"], ["P", "I"], ["Q", "E"], ["R", "B"], ["S", "F"], ["T", "Z"], ["U", "C"], ["V", "W"], ["W", "V"], ["X", "J"], ["Y", "A"], ["Z", "T"]
        ]);
        this._relativeOffset = 0;
    }

    get relativeOffset() {
        return this._relativeOffset;
    }

    set relativeOffset(offset) {
        this._relativeOffset = offset;
    }

    reflect(input) {
        // apply relative offset before reflecting
        const shiftedInput = Utility.getShiftedLetter(input, this.relativeOffset);
        return this._reflectorB.get(shiftedInput);
    }
}

export default Reflector;