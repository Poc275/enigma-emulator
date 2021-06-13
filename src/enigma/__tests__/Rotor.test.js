import Rotor from "../Rotor";

const rotorIMapping = ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"];

test("instance is correct", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1);
    expect(rotor).toBeInstanceOf(Rotor);
});

test("fields are set correctly", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1);
    expect(rotor._mapping).toEqual(rotorIMapping);
    expect(rotor._startPosition).toBe("A");
    expect(rotor._ringSetting).toBe(1);
});

test("applyRingSetting returns the same number of mapping elements", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1);
    rotor.applyRingSetting();
    expect(rotor._mapping.length).toEqual(26);
});

test("applyRingSetting returns the same number of mapping elements when a shift is applied", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 20);
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting._mapping.length).toEqual(26);
});

test("applyRingSetting does not modify the rotor mapping when set to 1", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1);
    rotor.applyRingSetting();
    expect(rotor._mapping).toEqual(rotorIMapping);
});

test("applyRingSetting modifies the rotor mapping correctly when set to 2", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 2);
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting._mapping).toEqual(
        ["K", "F", "L", "N", "G", "M", "H", "E", "R", "W", "A", "O", "U", "P", "X", "Z", "I", "Y", "V", "T", "Q", "B", "J", "C", "S", "D"]
    );
});

test("applyRingSetting modifies the rotor mapping correctly when set to 3", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 3);
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting._mapping).toEqual(
        ["E", "L", "G", "M", "O", "H", "N", "I", "F", "S", "X", "B", "P", "V", "Q", "Y", "A", "J", "Z", "W", "U", "R", "C", "K", "D", "T"]
    );
});

test("applyRingSetting modifies the rotor mapping correctly when set to 6", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 6);
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting._mapping).toEqual(
        ["N", "G", "W", "H", "O", "J", "P", "R", "K", "Q", "L", "I", "V", "A", "E", "S", "Y", "T", "B", "D", "M", "C", "Z", "X", "U", "F"]
    );
});

test("applyRingSetting modifies the rotor mapping correctly when set to 26", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 26);
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting._mapping).toEqual(
        ["J", "L", "E", "K", "F", "C", "P", "U", "Y", "M", "S", "N", "V", "X", "G", "W", "T", "R", "O", "Z", "H", "A", "Q", "B", "I", "D"]
    );
});
