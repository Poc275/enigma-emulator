import Rotor from "../Rotor";

const rotorIMapping = ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"];

test("instance is correct", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1, "R");
    expect(rotor).toBeInstanceOf(Rotor);
});

test("fields are set correctly", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1, "R");
    expect(rotor.mapping).toEqual(rotorIMapping);
    expect(rotor.position).toBe("A");
    expect(rotor.ringSetting).toBe(1);
    expect(rotor.stepPoint).toBe("R");
});

test("applyRingSetting returns the same number of mapping elements", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1, "R");
    rotor.applyRingSetting();
    expect(rotor.mapping.length).toEqual(26);
});

test("applyRingSetting returns the same number of mapping elements when a shift is applied", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 20, "R");
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting.mapping.length).toEqual(26);
});

test("applyRingSetting does not modify the rotor mapping when set to 1", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1, "R");
    rotor.applyRingSetting();
    expect(rotor.mapping).toEqual(rotorIMapping);
});

test("applyRingSetting modifies the rotor mapping correctly when set to 2", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 2, "R");
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting.mapping).toEqual(
        ["K", "F", "L", "N", "G", "M", "H", "E", "R", "W", "A", "O", "U", "P", "X", "Z", "I", "Y", "V", "T", "Q", "B", "J", "C", "S", "D"]
    );
});

test("applyRingSetting modifies the rotor mapping correctly when set to 3", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 3, "R");
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting.mapping).toEqual(
        ["E", "L", "G", "M", "O", "H", "N", "I", "F", "S", "X", "B", "P", "V", "Q", "Y", "A", "J", "Z", "W", "U", "R", "C", "K", "D", "T"]
    );
});

test("applyRingSetting modifies the rotor mapping correctly when set to 6", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 6, "R");
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting.mapping).toEqual(
        ["N", "G", "W", "H", "O", "J", "P", "R", "K", "Q", "L", "I", "V", "A", "E", "S", "Y", "T", "B", "D", "M", "C", "Z", "X", "U", "F"]
    );
});

test("applyRingSetting modifies the rotor mapping correctly when set to 26", () => {
    const rotorWithRingSetting = new Rotor(rotorIMapping, "A", 26, "R");
    rotorWithRingSetting.applyRingSetting();
    expect(rotorWithRingSetting.mapping).toEqual(
        ["J", "L", "E", "K", "F", "C", "P", "U", "Y", "M", "S", "N", "V", "X", "G", "W", "T", "R", "O", "Z", "H", "A", "Q", "B", "I", "D"]
    );
});

test("stepRotor modifies the position property", () => {
    const rotor = new Rotor(rotorIMapping, "A", 1, "R");
    rotor.stepRotor();
    expect(rotor.position).toEqual("B");
});

test.each`
position | expected
${"A"}   | ${"B"}
${"N"}   | ${"O"}
${"T"}   | ${"U"}
${"Y"}   | ${"Z"}
${"Z"}   | ${"A"}
`("stepRotor returns $expected when position is $position", ({position, expected}) => {
    const rotor = new Rotor(rotorIMapping, position, 1, "R");
    rotor.stepRotor();
    expect(rotor.position).toEqual(expected);
});

test.each`
input  | position | ringSetting | expected
${"A"} | ${"A"}   | ${1}        | ${"E"}
${"K"} | ${"A"}   | ${1}        | ${"N"}
${"Z"} | ${"A"}   | ${1}        | ${"J"}
${"A"} | ${"B"}   | ${1}        | ${"K"}
${"R"} | ${"B"}   | ${1}        | ${"S"}
${"Z"} | ${"B"}   | ${1}        | ${"E"}
${"A"} | ${"F"}   | ${1}        | ${"G"}
${"F"} | ${"F"}   | ${1}        | ${"N"}
${"Z"} | ${"F"}   | ${1}        | ${"L"}
${"A"} | ${"Q"}   | ${1}        | ${"X"}
${"X"} | ${"Q"}   | ${1}        | ${"W"}
${"Z"} | ${"Q"}   | ${1}        | ${"H"}
${"A"} | ${"Z"}   | ${1}        | ${"J"}
${"U"} | ${"Z"}   | ${1}        | ${"P"}
${"Z"} | ${"Z"}   | ${1}        | ${"C"}
${"A"} | ${"A"}   | ${2}        | ${"K"}
${"T"} | ${"A"}   | ${2}        | ${"T"}
${"Z"} | ${"A"}   | ${2}        | ${"D"}
${"A"} | ${"B"}   | ${2}        | ${"F"}
${"G"} | ${"B"}   | ${2}        | ${"E"}
${"Z"} | ${"B"}   | ${2}        | ${"K"}
${"A"} | ${"H"}   | ${2}        | ${"E"}
${"S"} | ${"H"}   | ${2}        | ${"D"}
${"Z"} | ${"H"}   | ${2}        | ${"H"}
${"A"} | ${"Z"}   | ${2}        | ${"D"}
${"W"} | ${"Z"}   | ${2}        | ${"B"}
${"Z"} | ${"Z"}   | ${2}        | ${"S"}
${"A"} | ${"A"}   | ${6}        | ${"N"}
${"D"} | ${"A"}   | ${6}        | ${"H"}
${"Z"} | ${"A"}   | ${6}        | ${"F"}
${"A"} | ${"R"}   | ${6}        | ${"T"}
${"R"} | ${"R"}   | ${6}        | ${"K"}
${"Z"} | ${"R"}   | ${6}        | ${"Y"}
${"A"} | ${"Z"}   | ${6}        | ${"F"}
${"P"} | ${"Z"}   | ${6}        | ${"E"}
${"Z"} | ${"Z"}   | ${6}        | ${"U"}
${"A"} | ${"A"}   | ${15}       | ${"C"}
${"L"} | ${"A"}   | ${15}       | ${"F"}
${"Z"} | ${"A"}   | ${15}       | ${"H"}
${"A"} | ${"E"}   | ${15}       | ${"L"}
${"N"} | ${"E"}   | ${15}       | ${"T"}
${"Z"} | ${"E"}   | ${15}       | ${"V"}
${"A"} | ${"Y"}   | ${15}       | ${"B"}
${"X"} | ${"Y"}   | ${15}       | ${"E"}
${"Z"} | ${"Y"}   | ${15}       | ${"N"}
${"A"} | ${"Z"}   | ${15}       | ${"H"}
${"C"} | ${"Z"}   | ${15}       | ${"K"}
${"Z"} | ${"Z"}   | ${15}       | ${"B"}
${"A"} | ${"A"}   | ${26}       | ${"J"}
${"I"} | ${"A"}   | ${26}       | ${"Y"}
${"Z"} | ${"A"}   | ${26}       | ${"D"}
${"A"} | ${"P"}   | ${26}       | ${"W"}
${"U"} | ${"P"}   | ${26}       | ${"M"}
${"Z"} | ${"P"}   | ${26}       | ${"G"}
${"A"} | ${"Z"}   | ${26}       | ${"D"}
${"V"} | ${"Z"}   | ${26}       | ${"H"}
${"Z"} | ${"Z"}   | ${26}       | ${"I"}
`("encipher returns $expected when input is $input with a position of $position and a ring setting of $ringSetting in the forwards direction", ({input, position, ringSetting, expected}) => {
    const rotor = new Rotor(rotorIMapping, position, ringSetting, "R");
    rotor.applyRingSetting();
    const result = rotor.encipher(input, true)
    expect(result).toEqual(expected);
});

test.each`
input  | position | ringSetting | expected
${"A"} | ${"A"}   | ${1}        | ${"U"}
${"P"} | ${"A"}   | ${1}        | ${"T"}
${"Z"} | ${"A"}   | ${1}        | ${"J"}
${"A"} | ${"B"}   | ${1}        | ${"W"}
${"C"} | ${"B"}   | ${1}        | ${"G"}
${"Z"} | ${"B"}   | ${1}        | ${"U"}
${"A"} | ${"N"}   | ${1}        | ${"K"}
${"Q"} | ${"N"}   | ${1}        | ${"G"}
${"Z"} | ${"N"}   | ${1}        | ${"C"}
${"A"} | ${"Z"}   | ${1}        | ${"J"}
${"I"} | ${"Z"}   | ${1}        | ${"P"}
${"Z"} | ${"Z"}   | ${1}        | ${"O"}
${"A"} | ${"A"}   | ${2}        | ${"K"}
${"W"} | ${"A"}   | ${2}        | ${"J"}
${"Z"} | ${"A"}   | ${2}        | ${"P"}
${"A"} | ${"B"}   | ${2}        | ${"V"}
${"J"} | ${"B"}   | ${2}        | ${"A"}
${"Z"} | ${"B"}   | ${2}        | ${"K"}
${"A"} | ${"M"}   | ${3}        | ${"D"}
${"F"} | ${"M"}   | ${3}        | ${"V"}
${"Z"} | ${"M"}   | ${3}        | ${"B"}
${"A"} | ${"S"}   | ${6}        | ${"P"}
${"S"} | ${"S"}   | ${6}        | ${"I"}
${"Z"} | ${"S"}   | ${6}        | ${"H"}
${"A"} | ${"V"}   | ${10}       | ${"L"}
${"G"} | ${"V"}   | ${10}       | ${"B"}
${"Z"} | ${"V"}   | ${10}       | ${"N"}
${"A"} | ${"Y"}   | ${15}       | ${"P"}
${"E"} | ${"Y"}   | ${15}       | ${"A"}
${"Z"} | ${"Y"}   | ${15}       | ${"N"}
${"A"} | ${"Z"}   | ${26}       | ${"T"}
${"K"} | ${"Z"}   | ${26}       | ${"A"}
${"Z"} | ${"Z"}   | ${26}       | ${"I"}
`("encipher returns $expected when input is $input with a position of $position and a ring setting of $ringSetting in the backwards direction", ({input, position, ringSetting, expected}) => {
    const rotor = new Rotor(rotorIMapping, position, ringSetting, "R");
    rotor.applyRingSetting();
    const result = rotor.encipher(input, false)
    expect(result).toEqual(expected);
});