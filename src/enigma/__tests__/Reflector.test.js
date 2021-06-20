import Reflector from "../Reflector";

test("instance is correct", () => {
    const reflector = new Reflector();
    expect(reflector).toBeInstanceOf(Reflector);
});

test("relative offset is initialised to zero", () => {
    const reflector = new Reflector();
    expect(reflector.relativeOffset).toEqual(0);
});

test("relative offset setter sets the correct value", () => {
    const reflector = new Reflector();
    expect(reflector.relativeOffset).toEqual(0);

    reflector.relativeOffset = 9;
    expect(reflector.relativeOffset).toEqual(9);
});

test("reflect returns a single letter", () => {
    const reflector = new Reflector();
    const output = reflector.reflect("A");
    expect(output.length).toEqual(1);
});

test.each`
input    | expected
${"A"}   | ${"Y"}
${"Y"}   | ${"A"}
${"X"}   | ${"J"}
${"J"}   | ${"X"}
${"C"}   | ${"U"}
`("reflect returns $expected when input letter is $input", ({input, expected}) => {
    const reflector = new Reflector();
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
`("reflect returns $expected when input letter is $input and relative offset is $relativeOffset", ({input, relativeOffset, expected}) => {
    const reflector = new Reflector();
    reflector.relativeOffset = relativeOffset;
    const output = reflector.reflect(input);

    expect(output).toEqual(expected);
});