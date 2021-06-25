import Enigma from "../Enigma";
import Rotor from "../Rotor";
import EntryRotor from "../EntryRotor";
import Plugboard from "../Plugboard";
import Reflector from "../Reflector";

const rotorIMapping = ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"];
const rotorIIMapping = ["A", "J", "D", "K", "S", "I", "R", "U", "X", "B", "L", "H", "W", "T", "M", "C", "Q", "G", "Z", "N", "P", "Y", "F", "V", "O", "E"];
const rotorIIIMapping = ["B", "D", "F", "H", "J", "L", "C", "P", "R", "T", "X", "V", "Z", "N", "Y", "E", "I", "W", "G", "A", "K", "M", "U", "S", "Q", "O"];

test("instance is correct", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    expect(enigma).toBeInstanceOf(Enigma);
});

test("enigma components are initialised", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    expect(enigma.plugboard).toEqual(new Plugboard());
    expect(enigma.entryRotor).toEqual(new EntryRotor());
    expect(enigma.lhsRotor).toEqual(rotorI);
    expect(enigma.middleRotor).toEqual(rotorII);
    expect(enigma.rhsRotor).toEqual(rotorIII);
    expect(enigma.reflector).toEqual(new Reflector("B"));
});

test("relative offsets are initialised to zeroes when all rotors start in the A position", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    expect(enigma.rhsRotor.forwardsRelativeOffset).toEqual(0);
    expect(enigma.middleRotor.forwardsRelativeOffset).toEqual(0);
    expect(enigma.lhsRotor.forwardsRelativeOffset).toEqual(0);
    expect(enigma.reflector.relativeOffset).toEqual(0);
    expect(enigma.rhsRotor.backwardsRelativeOffset).toEqual(0);
    expect(enigma.middleRotor.backwardsRelativeOffset).toEqual(0);
    expect(enigma.lhsRotor.backwardsRelativeOffset).toEqual(0);
    expect(enigma.entryRotor.relativeOffset).toEqual(0);
});

test("relative offsets are initialised correctly when rotors start in different positions", () => {
    const rotorI = new Rotor(rotorIMapping, "B", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "D", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "W", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    // forwards...
    expect(enigma.rhsRotor.forwardsRelativeOffset).toEqual(22);
    expect(enigma.middleRotor.forwardsRelativeOffset).toEqual(7);
    expect(enigma.lhsRotor.forwardsRelativeOffset).toEqual(24);
    expect(enigma.reflector.relativeOffset).toEqual(25);

    // backwards...
    expect(enigma.lhsRotor.backwardsRelativeOffset).toEqual(1);
    expect(enigma.middleRotor.backwardsRelativeOffset).toEqual(2);
    expect(enigma.rhsRotor.backwardsRelativeOffset).toEqual(19);
    expect(enigma.entryRotor.relativeOffset).toEqual(4);
});

test("relative offsets are updated correctly when the rotors step position", () => {
    const rotorI = new Rotor(rotorIMapping, "B", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "D", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "W", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    enigma.encipher("A");

    // forwards...
    // rhs rotor has stepped 1 position to "X" (position 23)
    // middle rotor is now "X" -> "D" which is a relative offset of 6
    expect(enigma.rhsRotor.forwardsRelativeOffset).toEqual(23);
    expect(enigma.middleRotor.forwardsRelativeOffset).toEqual(6);
    expect(enigma.lhsRotor.forwardsRelativeOffset).toEqual(24);
    expect(enigma.reflector.relativeOffset).toEqual(25);

    // backwards...
    expect(enigma.lhsRotor.backwardsRelativeOffset).toEqual(1);
    expect(enigma.middleRotor.backwardsRelativeOffset).toEqual(2);
    expect(enigma.rhsRotor.backwardsRelativeOffset).toEqual(20);
    expect(enigma.entryRotor.relativeOffset).toEqual(3);
});

test("encipher steps the rhs rotor after every letter", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    enigma.encipher("A");
    enigma.encipher("A");
    enigma.encipher("A");
    enigma.encipher("A");
    enigma.encipher("A");

    // rhs rotor should have stepped 5 times which leaves it at position F
    expect(enigma.rhsRotor.position).toEqual("F");
    // the other 2 rotors should not have stepped
    expect(enigma.middleRotor.position).toEqual("A");
    expect(enigma.lhsRotor.position).toEqual("A");
    expect(enigma.doubleStep).toBeFalsy();
});

test("encipher steps the middle rotor at the correct position", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "U", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));
    
    enigma.encipher("A");
    // rhs rotor should have stepped once
    expect(enigma.rhsRotor.position).toEqual("V");
    expect(enigma.middleRotor.position).toEqual("A");
    expect(enigma.lhsRotor.position).toEqual("A");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // now the rhs rotor reaches its step point the middle rotor should step as well
    expect(enigma.rhsRotor.position).toEqual("W");
    expect(enigma.middleRotor.position).toEqual("B");
    expect(enigma.lhsRotor.position).toEqual("A");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // the next step only moves the rhs rotor
    expect(enigma.rhsRotor.position).toEqual("X");
    expect(enigma.middleRotor.position).toEqual("B");
    expect(enigma.lhsRotor.position).toEqual("A");
    expect(enigma.doubleStep).toBeFalsy();
});

test("encipher double steps the rotors after 3 key presses with rotor configuration R1-R2-R3 and start positions A-D-U", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "D", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "U", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));

    enigma.encipher("A");
    // rhs rotor should have stepped once
    expect(enigma.rhsRotor.position).toEqual("V");
    expect(enigma.middleRotor.position).toEqual("D");
    expect(enigma.lhsRotor.position).toEqual("A");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // now the rhs rotor reaches its step point the middle rotor should step as well
    expect(enigma.rhsRotor.position).toEqual("W");
    expect(enigma.middleRotor.position).toEqual("E");
    expect(enigma.lhsRotor.position).toEqual("A");
    // because the middle rotor has moved into its step position (i.e. the next move will step it to F), 
    // the next key press will be a double step
    expect(enigma.doubleStep).toBeTruthy();

    enigma.encipher("A");
    // double step
    expect(enigma.rhsRotor.position).toEqual("X");
    expect(enigma.middleRotor.position).toEqual("F");
    expect(enigma.lhsRotor.position).toEqual("B");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // the next step only moves the rhs rotor
    expect(enigma.rhsRotor.position).toEqual("Y");
    expect(enigma.middleRotor.position).toEqual("F");
    expect(enigma.lhsRotor.position).toEqual("B");
    expect(enigma.doubleStep).toBeFalsy();
});

test("encipher double steps the rotors after 4 key presses with rotor configuration R3-R2-R1 and start positions K-D-O", () => {
    const rotorI = new Rotor(rotorIMapping, "O", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "D", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "K", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorI, rotorII, rotorIII, new Reflector("B"));

    enigma.encipher("A");
    // rhs rotor should have stepped once
    expect(enigma.rhsRotor.position).toEqual("P");
    expect(enigma.middleRotor.position).toEqual("D");
    expect(enigma.lhsRotor.position).toEqual("K");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // rhs rotor should have stepped once more
    expect(enigma.rhsRotor.position).toEqual("Q");
    expect(enigma.middleRotor.position).toEqual("D");
    expect(enigma.lhsRotor.position).toEqual("K");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // rhs rotor now steps the middle rotor
    // because the middle rotor has moved into its step position (i.e. the next move will step it to F), 
    // the next key press will be a double step
    expect(enigma.rhsRotor.position).toEqual("R");
    expect(enigma.middleRotor.position).toEqual("E");
    expect(enigma.lhsRotor.position).toEqual("K");
    expect(enigma.doubleStep).toBeTruthy();

    enigma.encipher("A");
    // double step
    expect(enigma.rhsRotor.position).toEqual("S");
    expect(enigma.middleRotor.position).toEqual("F");
    expect(enigma.lhsRotor.position).toEqual("L");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // the next step only moves the rhs rotor
    expect(enigma.rhsRotor.position).toEqual("T");
    expect(enigma.middleRotor.position).toEqual("F");
    expect(enigma.lhsRotor.position).toEqual("L");
    expect(enigma.doubleStep).toBeFalsy();

    enigma.encipher("A");
    // the next step only moves the rhs rotor
    expect(enigma.rhsRotor.position).toEqual("U");
    expect(enigma.middleRotor.position).toEqual("F");
    expect(enigma.lhsRotor.position).toEqual("L");
    expect(enigma.doubleStep).toBeFalsy();
});

test("encipher returns correct letter with enigma set to base configuration", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));
    const result = enigma.encipher("A");

    expect(result).toEqual("B");
});

test("encipher returns correct letter with enigma set with different start positions and ring settings", () => {
    const rotorI = new Rotor(rotorIMapping, "B", 6, "R");
    const rotorII = new Rotor(rotorIIMapping, "C", 2, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "V", 2, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));
    const result = enigma.encipher("A");

    expect(result).toEqual("Y");
});

test("encipher returns correct sequence with enigma set to base configuration", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));
    
    const sequence = [];
    for(let i = 0; i < 5; i++) {
        sequence.push(enigma.encipher("A"));
    }

    // sequence according to https://en.wikipedia.org/wiki/Enigma_rotor_details
    expect(sequence.join("")).toEqual("BDZGO");
});

test("encipher returns correct sequence with ring settings in B-position", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 2, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 2, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 2, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector("B"));
    
    const sequence = [];
    for(let i = 0; i < 5; i++) {
        sequence.push(enigma.encipher("A"));
    }

    // sequence according to https://en.wikipedia.org/wiki/Enigma_rotor_details
    expect(sequence.join("")).toEqual("EWTYX");
});

test("encipher returns correct message with plugboard settings set", () => {
    // this test comes from: http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages
    // using the Enigma Instruction Manual, 1930  message with key (rotor start positions) ABL
    const rotorI = new Rotor(rotorIMapping, "B", 13, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 24, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "L", 22, "W");
    const plugboard = new Plugboard();
    plugboard.addSetting("A", "M");
    plugboard.addSetting("F", "I");
    plugboard.addSetting("N", "V");
    plugboard.addSetting("P", "S");
    plugboard.addSetting("T", "U");
    plugboard.addSetting("W", "Z");

    const enigma = new Enigma(plugboard, new EntryRotor(), rotorIII, rotorI, rotorII, new Reflector("A"));
    const message = "GCDSEAHUGWTQGRKVLFGXUCALXVYMIGMMNMFDXTGNVHVRMMEVOUYFZSLRHDRRXFJWCFHUHMUNZEFRDISIKBGPMYVXUZ";
    
    const encipheredMsg = [];
    for(let i = 0; i < message.length; i++) {
        encipheredMsg.push(enigma.encipher(message.charAt(i)));
    }

    // Enigma conventions: X for a space/full stop, J for a quotation mark, Q = CH
    // (German):  FEINDLICH(Q)E INFANTERIE KOLONNE BEOBACH(Q)TET X ANFANG    SUEDAUSGANG         BAERWALDE X ENDE   DREI  KM  OSTWAERTS NEUSTADT
    // (English): ENEMY         INFANTRY   COLUMNS OBSERVED      . BEGINNING AT SOUTH EXIT OF    BAERWALDE . ENDING THREE KM  EAST OF   NEUSTADT.
    const expected = "FEINDLIQEINFANTERIEKOLONNEBEOBAQTETXANFANGSUEDAUSGANGBAERWALDEXENDEDREIKMOSTWAERTSNEUSTADT";
    expect(encipheredMsg.join("")).toEqual(expected);
});