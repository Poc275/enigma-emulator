import Utility from "./Utility";

class Enigma {

    constructor(plugboard, entryRotor, rhsRotor, mRotor, lhsRotor, reflector) {
        this._plugboard = plugboard;
        this._entryRotor = entryRotor;
        this._rhsRotor = rhsRotor;
        this._mRotor = mRotor;
        this._lhsRotor = lhsRotor;
        this._reflector = reflector;
        this._doubleStep = false;
        this.calculateRelativeOffsets();
    }

    get plugboard() {
        return this._plugboard;
    }

    get entryRotor() {
        return this._entryRotor;
    }

    get rhsRotor() {
        return this._rhsRotor;
    }

    get middleRotor() {
        return this._mRotor;
    }

    get lhsRotor() {
        return this._lhsRotor;
    }

    get reflector() {
        return this._reflector;
    }

    get relativeOffsets() {
        return this._relativeOffsets;
    }

    get doubleStep() {
        return this._doubleStep;
    }
    set doubleStep(val) {
        this._doubleStep = val;
    }

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

    encipher(letter) {
        // advance rotors once an enigma key is pressed BEFORE enciphering any letters
        // the rhs rotor always steps after every keypress
        this.rhsRotor.stepRotor();

        // double step check
        if(this.doubleStep) {
            this.middleRotor.stepRotor();
            this.doubleStep = false;

            // middle rotor has stepped, check if the lhs rotor is to be stepped
            if(this.middleRotor.position === this.middleRotor.stepPoint) {
                // middle rotor has reached its turnover point, advance the lhs rotor
                this.lhsRotor.stepRotor();
            }
        }

        // check if the adjacent rotors are stepped
        if(this.rhsRotor.position === this.rhsRotor.stepPoint) {
            // rhs rotor has reached its turnover point, advance the middle rotor
            this.middleRotor.stepRotor();

            // middle rotor has stepped, check if the lhs rotor is to be stepped
            if(this.middleRotor.position === this.middleRotor.stepPoint) {
                this.lhsRotor.stepRotor();
            }

            // if the middle rotor has moved into its notch position then on the 
            // next keypress the lhs rotor will be moved which will also move the 
            // middle rotor i.e. a double step
            if(this.middleRotor.position === Utility.getShiftedLetter(this.middleRotor.stepPoint, -1)) {
                this.doubleStep = true;
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