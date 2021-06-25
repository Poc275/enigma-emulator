import Reflector from "../Reflector";

test("instance is correct", () => {
    const reflector = new Reflector("A");
    expect(reflector).toBeInstanceOf(Reflector);
});

test("reflector A settings are applied correctly", () => {
    const reflector = new Reflector("A");
    expect(reflector.reflectorSettings).toEqual(new Map([
        ["A", "E"], ["B", "J"], ["C", "M"], ["D", "Z"], ["E", "A"], ["F", "L"], ["G", "Y"], ["H", "X"], ["I", "V"], ["J", "B"], ["K", "W"], ["L", "F"], ["M", "C"], 
        ["N", "R"], ["O", "Q"], ["P", "U"], ["Q", "O"], ["R", "N"], ["S", "T"], ["T", "S"], ["U", "P"], ["V", "I"], ["W", "K"], ["X", "H"], ["Y", "G"], ["Z", "D"]
    ]));
});

test("reflector B settings are applied correctly", () => {
    const reflector = new Reflector("B");
    expect(reflector.reflectorSettings).toEqual(new Map([
        ["A", "Y"], ["B", "R"], ["C", "U"], ["D", "H"], ["E", "Q"], ["F", "S"], ["G", "L"], ["H", "D"], ["I", "P"], ["J", "X"], ["K", "N"], ["L", "G"], ["M", "O"], 
        ["N", "K"], ["O", "M"], ["P", "I"], ["Q", "E"], ["R", "B"], ["S", "F"], ["T", "Z"], ["U", "C"], ["V", "W"], ["W", "V"], ["X", "J"], ["Y", "A"], ["Z", "T"]
    ]));
});

test("unknown reflector in the constructor throws an error", () => {
    expect(() => new Reflector("NA")).toThrow();
});

test("relative offset is initialised to zero", () => {
    const reflector = new Reflector("A");
    expect(reflector.relativeOffset).toEqual(0);
});

test("relative offset setter sets the correct value", () => {
    const reflector = new Reflector("A");
    expect(reflector.relativeOffset).toEqual(0);

    reflector.relativeOffset = 9;
    expect(reflector.relativeOffset).toEqual(9);
});

test("reflect returns a single letter", () => {
    const reflector = new Reflector("A");
    const output = reflector.reflect("A");
    expect(output.length).toEqual(1);
});

test.each`
input    | expected
${"A"}   | ${"E"}
${"Y"}   | ${"G"}
${"X"}   | ${"H"}
${"J"}   | ${"B"}
${"E"}   | ${"A"}
`("reflect returns $expected when input letter is $input for reflector A", ({input, expected}) => {
    const reflector = new Reflector("A");
    const output = reflector.reflect(input);
    expect(output).toEqual(expected);
});

test.each`
input    | expected
${"A"}   | ${"Y"}
${"Y"}   | ${"A"}
${"X"}   | ${"J"}
${"J"}   | ${"X"}
${"C"}   | ${"U"}
`("reflect returns $expected when input letter is $input for reflector B", ({input, expected}) => {
    const reflector = new Reflector("B");
    const output = reflector.reflect(input);
    expect(output).toEqual(expected);
});

test.each`
input    | relativeOffset | expected
${"A"}   | ${1}           | ${"J"}
${"F"}   | ${2}           | ${"X"}
${"P"}   | ${12}          | ${"J"}
${"A"}   | ${25}          | ${"D"}
${"B"}   | ${25}          | ${"E"}
`("reflect returns $expected when input letter is $input and relative offset is $relativeOffset for reflector A", ({input, relativeOffset, expected}) => {
    const reflector = new Reflector("A");
    reflector.relativeOffset = relativeOffset;
    const output = reflector.reflect(input);

    expect(output).toEqual(expected);
});

test.each`
input    | relativeOffset | expected
${"A"}   | ${1}           | ${"R"}
${"F"}   | ${2}           | ${"D"}
${"P"}   | ${12}          | ${"R"}
${"A"}   | ${25}          | ${"T"}
${"B"}   | ${25}          | ${"Y"}
`("reflect returns $expected when input letter is $input and relative offset is $relativeOffset for reflector B", ({input, relativeOffset, expected}) => {
    const reflector = new Reflector("B");
    reflector.relativeOffset = relativeOffset;
    const output = reflector.reflect(input);

    expect(output).toEqual(expected);
});