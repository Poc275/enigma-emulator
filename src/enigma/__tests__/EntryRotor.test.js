import EntryRotor from "../EntryRotor";

test("instance is correct", () => {
    const entryRotor = new EntryRotor();
    expect(entryRotor).toBeInstanceOf(EntryRotor);
});

test("relative offset is initialised to zero", () => {
    const entryRotor = new EntryRotor();
    expect(entryRotor.relativeOffset).toEqual(0);
});

test("relative offset setter sets the correct value", () => {
    const entryRotor = new EntryRotor();
    expect(entryRotor.relativeOffset).toEqual(0);

    entryRotor.relativeOffset = 13;
    expect(entryRotor.relativeOffset).toEqual(13);
});

test("getEntryRotorOutput returns a single letter", () => {
    const entryRotor = new EntryRotor();
    const output = entryRotor.getEntryRotorOutput("A");

    expect(output.length).toEqual(1);
});

test.each`
input    | relativeOffset | expected
${"A"}   | ${1}           | ${"B"}
${"F"}   | ${2}           | ${"H"}
${"P"}   | ${12}          | ${"B"}
${"A"}   | ${25}          | ${"Z"}
${"B"}   | ${25}          | ${"A"}
`("getEntryRotorOutput returns $expected when input letter is $input and relative offset is $relativeOffset", ({input, relativeOffset, expected}) => {
    const entryRotor = new EntryRotor();
    entryRotor.relativeOffset = relativeOffset;
    const output = entryRotor.getEntryRotorOutput(input);

    expect(output).toEqual(expected);
});