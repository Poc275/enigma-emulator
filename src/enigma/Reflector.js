import Utility from "./Utility";

class Reflector {

    constructor(reflector) {
        const reflectorASettings = new Map([
            ["A", "E"], ["B", "J"], ["C", "M"], ["D", "Z"], ["E", "A"], ["F", "L"], ["G", "Y"], ["H", "X"], ["I", "V"], ["J", "B"], ["K", "W"], ["L", "F"], ["M", "C"], 
            ["N", "R"], ["O", "Q"], ["P", "U"], ["Q", "O"], ["R", "N"], ["S", "T"], ["T", "S"], ["U", "P"], ["V", "I"], ["W", "K"], ["X", "H"], ["Y", "G"], ["Z", "D"]
        ]);

        const reflectorBSettings = new Map([
            ["A", "Y"], ["B", "R"], ["C", "U"], ["D", "H"], ["E", "Q"], ["F", "S"], ["G", "L"], ["H", "D"], ["I", "P"], ["J", "X"], ["K", "N"], ["L", "G"], ["M", "O"], 
            ["N", "K"], ["O", "M"], ["P", "I"], ["Q", "E"], ["R", "B"], ["S", "F"], ["T", "Z"], ["U", "C"], ["V", "W"], ["W", "V"], ["X", "J"], ["Y", "A"], ["Z", "T"]
        ]);
        
        switch(reflector) {
            case "A":
                this._reflectorSettings = reflectorASettings;
                break;

            case "B":
                this._reflectorSettings = reflectorBSettings;
                break;

            default:
                throw new Error(`Unknown reflector ${reflector}. Valid reflectors are "A" and "B".`);
        }

        this._relativeOffset = 0;
    }

    get relativeOffset() {
        return this._relativeOffset;
    }

    set relativeOffset(offset) {
        this._relativeOffset = offset;
    }

    get reflectorSettings() {
        return this._reflectorSettings;
    }

    reflect(input) {
        // apply relative offset before reflecting
        const shiftedInput = Utility.getShiftedLetter(input, this.relativeOffset);
        return this.reflectorSettings.get(shiftedInput);
    }
}

export default Reflector;