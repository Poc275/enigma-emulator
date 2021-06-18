class Plugboard {

    constructor() {
        this._settings = new Map();
    }

    get settings() {
        return this._settings;
    }

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

    clearSettings() {
        this._settings.clear();
    }

    convert(input) {
        if(this._settings.has(input)) {
            return this.settings.get(input);
        }

        // if the letter isn't set just return the original letter
        return input;
    }
}

export default Plugboard;