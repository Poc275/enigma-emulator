/**
 * Enigma plugboard class.
 */
class Plugboard {

    /**
     * Plugboard constructor.
     * @constructor
     */
    constructor() {
        this._settings = new Map();
    }

    /**
     * Get the plugboard settings.
     * @returns {Map} The plugboard settings.
     */
    get settings() {
        return this._settings;
    }

    /**
     * Adds a new plugboard setting. Also adds the reverse setting and overwrites if 
     * that letter is already set.
     * @param {string} input - Input letter.
     * @param {string} output - Output letter.
     */
    addSetting(input, output) {
        if(this._settings.has(input)) {
            // letter is already set, reset the previous inverse mapping before overwriting
            const originalMapping = this._settings.get(input);
            this._settings.delete(originalMapping);
        }

        this._settings.set(input, output);
        // add the reverse, could work this out in the 
        // convert function but is easier this way
        this._settings.set(output, input);
    }

    /**
     * Clears all plugboard settings.
     */
    clearSettings() {
        this._settings.clear();
    }

    /**
     * Converts a letter through the plugboard.
     * @param {string} input - Input letter.
     * @returns {string} Output letter. If that letter isn't set the same letter is returned.
     */
    convert(input) {
        if(this._settings.has(input)) {
            return this.settings.get(input);
        }

        // if the letter isn't set just return the original letter
        return input;
    }
}

export default Plugboard;