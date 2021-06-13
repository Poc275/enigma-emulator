import Utility from "./Utility";

class Rotor {

    constructor(mapping, startPosition, ringSetting) {
        this._mapping = [...mapping];
        this._position = startPosition;
        this._ringSetting = ringSetting;
    }

    stepRotor() {
        this._position = Utility.getShiftedLetter(this._position, 1);
    }

    applyRingSetting() {
        // the engima ring setting shifts the mappings between letters i.e. the output
        const shiftedLetters = [];

        for(let i = 1; i < this._ringSetting; i++) {
            shiftedLetters.push(this._mapping.pop());
        }

        // now add the shifted letters to the beginning, we reverse the shifted letters 
        // because push appends the letter to the end of the array
        const shiftedMapping = shiftedLetters.reverse().concat(this._mapping);

        // now shift the letter by the ring setting i.e. ring setting = 2: A -> B, B -> C etc.
        this._mapping = shiftedMapping.map(letter => {
            // -1 from the ring setting as a setting of 1 is ring setting A-01, which doesn't shift,
            // B-02 shifts 1 position, C-03 2 positions etc. etc.
            return Utility.getShiftedLetter(letter, this._ringSetting - 1);
        });
    }
}

export default Rotor;