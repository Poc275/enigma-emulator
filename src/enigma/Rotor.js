import Utility from "./Utility";

class Rotor {

    constructor(mapping, startPosition, ringSetting, stepPoint) {
        this._mapping = [...mapping];
        this._position = startPosition;
        this._ringSetting = ringSetting;
        this._stepPoint = stepPoint;
    }

    get mapping() {
        return this._mapping;
    }

    get position() {
        return this._position;
    }

    get ringSetting() {
        return this._ringSetting;
    }

    get stepPoint() {
        return this._stepPoint;
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

    encipher(letter, forwards) {
        // get input letter to rotor which is the alphabet index of the letter plus the rotor's current position
        const idx = Utility.getCharacterCode(letter);
        const rotorPosIdx = Utility.getCharacterCode(this._position);
        const mappingIdx = Utility.getModulo(idx + rotorPosIdx, 26);

        if(forwards) {           
            return this._mapping[mappingIdx];

        } else if(!forwards) {
            // for backwards mapping we must get the index of the input letter from the mapping (+65 as A is ASCII code 65)
            const inputLetter = Utility.getCharacterFromCode(mappingIdx + 65);
            const inputLetterIdx = this._mapping.findIndex(el => el === inputLetter);

            return Utility.getCharacterFromCode(inputLetterIdx + 65);
        }
    }
}

export default Rotor;