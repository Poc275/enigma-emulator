import Utility from "./Utility";

/**
 * Enigma machine class.
 */
class Enigma {

    /**
     * Engima machine constructor.
     * @constructor
     * @param {Plugboard} plugboard - Plugboard
     * @param {EntryRotor} entryRotor - Entry rotor
     * @param {Rotor} rhsRotor - Right-hand (fast) rotor
     * @param {Rotor} mRotor - Middle (slower) rotor
     * @param {Rotor} lhsRotor - Left-hand (slowest) rotor
     * @param {Reflector} reflector - Reflector
     */
    constructor(plugboard, entryRotor, rhsRotor, mRotor, lhsRotor, reflector) {
        this._plugboard = plugboard;
        this._entryRotor = entryRotor;
        this._rhsRotor = rhsRotor;
        this._mRotor = mRotor;
        this._lhsRotor = lhsRotor;
        this._reflector = reflector;
        this._doubleStep = false;

        this.calculateRelativeOffsets();
        // we could potentially start in double step conditions
        this.doubleStepCheck();
    }

    /**
     * Get the enigma plugboard.
     * @returns {Plugboard} The enigma plugboard.
     */
    get plugboard() {
        return this._plugboard;
    }

    /**
     * Get the enigma entry rotor.
     * @returns {EntryRotor} The enigma entry rotor.
     */
    get entryRotor() {
        return this._entryRotor;
    }

    /**
     * Get the enigma right-hand (fast) rotor.
     * @returns {Rotor} The enigma right-hand (fast) rotor.
     */
    get rhsRotor() {
        return this._rhsRotor;
    }

    /**
     * Get the enigma middle (slower) rotor.
     * @returns {Rotor} The enigma middle (slower) rotor.
     */
    get middleRotor() {
        return this._mRotor;
    }

    /**
     * Get the enigma left-hand (slowest) rotor.
     * @returns {Rotor} The enigma left-hand (slowest) rotor.
     */
    get lhsRotor() {
        return this._lhsRotor;
    }

    /**
     * Get the enigma reflector.
     * @returns {Reflector} The enigma reflector.
     */
    get reflector() {
        return this._reflector;
    }

    /**
     * Get the double step setting.
     * @returns {boolean} The double step setting.
     */
    get doubleStep() {
        return this._doubleStep;
    }

    /**
     * Set the enigma double step setting.
     * @param {boolean} val - Next step is a double step (true) or not (false).
     */
    set doubleStep(val) {
        this._doubleStep = val;
    }

    /**
     * Calculates the relative offsets between rotors, reflector and entry rotor in both directions.
     */
    calculateRelativeOffsets() {
        // forwards offsets
        // Input to the RHS rotor comes from the entry rotor (ETW) which doesn't move so is always in the 'A' position
        this.rhsRotor.forwardsRelativeOffset = Utility.getRelativeOffset("A", this.rhsRotor.position);
        this.middleRotor.forwardsRelativeOffset = Utility.getRelativeOffset(this.rhsRotor.position, this.middleRotor.position);
        this.lhsRotor.forwardsRelativeOffset = Utility.getRelativeOffset(this.middleRotor.position, this.lhsRotor.position);
        // The reflector doesn't move so is always in the 'A' position
        this.reflector.relativeOffset = Utility.getRelativeOffset(this.lhsRotor.position, "A");

        // backwards offsets
        this.lhsRotor.backwardsRelativeOffset = Utility.getRelativeOffset("A", this.lhsRotor.position);
        this.middleRotor.backwardsRelativeOffset = Utility.getRelativeOffset(this.lhsRotor.position, this.middleRotor.position);
        this.rhsRotor.backwardsRelativeOffset = Utility.getRelativeOffset(this.middleRotor.position, this.rhsRotor.position);
        // entry rotor output offset (input is always 0)
        this.entryRotor.relativeOffset = Utility.getRelativeOffset(this.rhsRotor.position, "A");
    }

    /**
     * Checks if the next step is to be a double step.
     */
    doubleStepCheck() {
        this.middleRotor.stepPoints.forEach(stepPoint => {
            // we need to check if the middle rotor is in its notch position i.e. the next step 
            // will engage the notch which is why -1 from the step point
            if(this.middleRotor.position === Utility.getShiftedLetter(stepPoint, -1)) {
                this._doubleStep = true;
            }
        });
    }

    /**
     * Scrambles a letter through the Engima.
     * @param {string} letter - Letter to encipher.
     * @returns {string} Scrambled letter. 
     */
    encipher(letter) {
        // advance rotors once an enigma key is pressed BEFORE enciphering any letters
        // the rhs rotor always steps after every keypress
        this.rhsRotor.stepRotor();

        // double step?
        if(this.doubleStep) {
            this.middleRotor.stepRotor();
            this.doubleStep = false;

            // middle rotor has stepped, check if the lhs rotor is to be stepped
            if(this.middleRotor.stepPoints.includes(this.middleRotor.position)) {
                // middle rotor has reached its turnover point, advance the lhs rotor
                this.lhsRotor.stepRotor();
            }
        } else {
            // check if the adjacent rotors are stepped
            if(this.rhsRotor.stepPoints.includes(this.rhsRotor.position)) {
                // rhs rotor has reached its turnover point, advance the middle rotor
                this.middleRotor.stepRotor();

                // middle rotor has stepped, check if the lhs rotor is to be stepped
                if(this.middleRotor.stepPoints.includes(this.middleRotor.position)) {
                    this.lhsRotor.stepRotor();
                }

                // if the middle rotor has moved into its notch position then on the 
                // next keypress the lhs rotor will be moved which will also move the 
                // middle rotor i.e. a double step, so check for this here
                this.doubleStepCheck();
            }
        }

        // update rotor relative offset positions once they have stepped
        this.calculateRelativeOffsets();

        // now we can encipher the letter
        // first it goes through the plugboard
        const plugboardIn = this.plugboard.convert(letter);

        // forwards...
        const rhsFwdOut = this.rhsRotor.encipher(plugboardIn, true);
        const midFwdOut = this.middleRotor.encipher(rhsFwdOut, true);
        const lhsFwdOut = this.lhsRotor.encipher(midFwdOut, true);

        // reflector
        const reflectorOut = this.reflector.reflect(lhsFwdOut);

        // backwards...
        const lhsBwdOut = this.lhsRotor.encipher(reflectorOut, false);
        const midBwdOut = this.middleRotor.encipher(lhsBwdOut, false);
        const rhsBwdOut = this.rhsRotor.encipher(midBwdOut, false);

        // entry rotor (ETW)
        const etwOut = this.entryRotor.getEntryRotorOutput(rhsBwdOut);

        // and back out the plugboard
        const plugboardOut = this.plugboard.convert(etwOut);

        return plugboardOut;
    }
}

export default Enigma;