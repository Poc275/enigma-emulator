import Utility from "./Utility";

class EntryRotor {

    constructor() {
        this._relativeOffset = 0;
    }

    get relativeOffset() {
        return this._relativeOffset;
    }

    set relativeOffset(offset) {
        this._relativeOffset = offset;
    }

    getEntryRotorOutput(input) {
        return Utility.getShiftedLetter(input, this.relativeOffset);
    }
}

export default EntryRotor;