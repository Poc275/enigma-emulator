import Utility from "./Utility";

/**
 * Enigma entry rotor (ETW) class.
 */
class EntryRotor {

    /**
     * Entry rotor constructor.
     * @constructor
     */
    constructor() {
        this._relativeOffset = 0;
    }

    /**
     * Get the entry rotor offset.
     * @returns {number} The entry rotor offset.
     */
    get relativeOffset() {
        return this._relativeOffset;
    }

    /**
     * Set the entry rotor's offset.
     * @param {number} offset - Offset value.
     */
    set relativeOffset(offset) {
        this._relativeOffset = offset;
    }

    /**
     * Get the output of the entry rotor.
     * @param {string} input - Input letter.
     * @returns {string} Output letter.
     */
    getEntryRotorOutput(input) {
        return Utility.getShiftedLetter(input, this.relativeOffset);
    }
}

export default EntryRotor;