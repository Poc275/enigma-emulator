import Reflector from "../Reflector";

test("instance is correct", () => {
    const reflector = new Reflector();
    expect(reflector).toBeInstanceOf(Reflector);
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