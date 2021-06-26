import Utility from "./Utility";

/**
 * Enigma rotor class.
 */
class Rotor {

    /**
     * Rotor constructor.
     * @constructor
     * @param {Array} mapping - Rotor permutations ordered from A-Z
     * @param {string} startPosition - Rotor start position letter
     * @param {number} ringSetting - Rotor ring setting
     * @param {Array} stepPoints - Array of letter positions where the rotor stepping mechanism is applied
     */
    constructor(mapping, startPosition, ringSetting, stepPoints) {
        this._mapping = [...mapping];
        this._position = startPosition;
        this._fwdRelativeOffset = 0;
        this._bwdRelativeOffset = 0;
        this._ringSetting = ringSetting;
        this._stepPoints = [...stepPoints];
        this.applyRingSetting();
    }

    /**
     * Get the rotor mapping.
     * @returns {Array} The rotor mapping.
     */
    get mapping() {
        return this._mapping;
    }

    /**
     * Get the current rotor position.
     * @returns {string} The current rotor position letter.
     */
    get position() {
        return this._position;
    }

    /**
     * Set the rotor position.
     * @param {string} pos - The rotor position letter
     */
    set position(pos) {
        this._position = pos;
    }

    /**
     * Get the rotor ring setter.
     * @returns {number} The rotor ring setting.
     */
    get ringSetting() {
        return this._ringSetting;
    }

    /**
     * Get the rotor step points.
     * @returns {Array} The rotor step points.
     */
    get stepPoints() {
        return this._stepPoints;
    }

    /**
     * Get the relative offset in the forward direction.
     * @returns {number} The relative offset in the forward direction.
     */
    get forwardsRelativeOffset() {
        return this._fwdRelativeOffset;
    }

    /**
     * Set the relative offset in the forward direction.
     * @param {number} offset - Relative offset in the forward direction
     */
    set forwardsRelativeOffset(offset) {
        this._fwdRelativeOffset = offset;
    }

    /**
     * Get the relative offset in the backward direction.
     * @returns {number} The relative offset in the backward direction.
     */
    get backwardsRelativeOffset() {
        return this._bwdRelativeOffset;
    }

    /**
     * Set the relative offset in the backward direction.
     * @param {number} offset - Relative offset in the backward direction
     */
    set backwardsRelativeOffset(offset) {
        this._bwdRelativeOffset = offset;
    }

    /**
     * Steps the rotor to its next position.
     */
    stepRotor() {
        this._position = Utility.getShiftedLetter(this._position, 1);
    }

    /**
     * Applies the ring setting to the rotor.
     */
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

    /**
     * Scrambles a letter through the rotor.
     * @param {string} letter - Letter to encipher
     * @param {boolean} forwards - Forward direction (true) or backwards (false)
     * @returns {string} - Scrambled letter.
     */
    encipher(letter, forwards) {
        // get input letter to rotor which is the alphabet index of the letter plus the rotor's current position
        const idx = Utility.getCharacterCode(letter);

        if(forwards) {
            const mappingIdx = Utility.getModulo(idx + this.forwardsRelativeOffset, 26);
            return this.mapping[mappingIdx];

        } else {
            const mappingIdx = Utility.getModulo(idx + this.backwardsRelativeOffset, 26);

            // for backwards mapping we must get the index of the input letter from the mapping (+65 as A is ASCII code 65)
            const inputLetter = Utility.getCharacterFromCode(mappingIdx + 65);
            const inputLetterIdx = this.mapping.findIndex(el => el === inputLetter);

            return Utility.getCharacterFromCode(inputLetterIdx + 65);
        }
    }
}

export default Rotor;