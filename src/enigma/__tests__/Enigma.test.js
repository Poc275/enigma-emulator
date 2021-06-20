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
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());

    expect(enigma).toBeInstanceOf(Enigma);
});

test("enigma components are initialised", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());

    expect(enigma.plugboard).toEqual(new Plugboard());
    expect(enigma.entryRotor).toEqual(new EntryRotor());
    expect(enigma.lhsRotor).toEqual(rotorI);
    expect(enigma.middleRotor).toEqual(rotorII);
    expect(enigma.rhsRotor).toEqual(rotorIII);
    expect(enigma.reflector).toEqual(new Reflector());
});

test("relative offsets are initialised to zeroes when all rotors start in the A position", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());

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
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());

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
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());

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
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());

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
});

test("encipher steps the middle rotor at the correct position", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());
    // lhs should step the middle rotor at position W, i.e. 22nd step
    for(let i = 0; i < 22; i++) {
        enigma.encipher("A");
    }

    // rhs rotor should have stepped 22 times which leaves it at position W
    expect(enigma.rhsRotor.position).toEqual("W");
    // the middle rotor should have stepped once
    expect(enigma.middleRotor.position).toEqual("B");
    // the lhs rotor should not have stepped
    expect(enigma.lhsRotor.position).toEqual("A");
});

test("encipher steps the lhs rotor at the correct position", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());
    // rhs rotor has to go through 5 complete revolutions to get the middle rotor to position 
    // F where it will step the lhs rotor i.e. 5 * 26 (-4 as it steps at position W) = 126
    for(let i = 0; i < 126; i++) {
        enigma.encipher("A");
    }

    expect(enigma.rhsRotor.position).toEqual("W");
    // the middle rotor should have stepped five times
    expect(enigma.middleRotor.position).toEqual("F");
    // the lhs rotor should have stepped once
    expect(enigma.lhsRotor.position).toEqual("B");
});

test("encipher returns correct letter with enigma set to base configuration", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());
    const result = enigma.encipher("A");

    expect(result).toEqual("B");
});

test("encipher returns correct letter with enigma set with different start positions and ring settings", () => {
    const rotorI = new Rotor(rotorIMapping, "B", 6, "R");
    const rotorII = new Rotor(rotorIIMapping, "C", 2, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "V", 2, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());
    const result = enigma.encipher("A");

    expect(result).toEqual("Y");
});

test("encipher returns correct sequence with enigma set to base configuration", () => {
    const rotorI = new Rotor(rotorIMapping, "A", 1, "R");
    const rotorII = new Rotor(rotorIIMapping, "A", 1, "F");
    const rotorIII = new Rotor(rotorIIIMapping, "A", 1, "W");
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());
    
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
    const enigma = new Enigma(new Plugboard(), new EntryRotor(), rotorIII, rotorII, rotorI, new Reflector());
    
    const sequence = [];
    for(let i = 0; i < 5; i++) {
        sequence.push(enigma.encipher("A"));
    }

    // sequence according to https://en.wikipedia.org/wiki/Enigma_rotor_details
    expect(sequence.join("")).toEqual("EWTYX");
});