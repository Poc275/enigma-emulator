import Plugboard from "../Plugboard";

test("instance is correct", () => {
    const plugboard = new Plugboard();
    expect(plugboard).toBeInstanceOf(Plugboard);
});

test("plugboard settings are initialised", () => {
    const plugboard = new Plugboard();
    expect(plugboard.settings).toEqual(new Map());
});

test("addSetting adds the plugboard setting along with its inverse", () => {
    const plugboard = new Plugboard();
    plugboard.addSetting("U", "A");
    expect(plugboard.settings).toEqual(new Map([
        ["U", "A"], ["A", "U"]
    ]));
});

test("addSetting overwrites any previously set letters", () => {
    const plugboard = new Plugboard();
    plugboard.addSetting("U", "A");
    plugboard.addSetting("P", "F");
    plugboard.addSetting("U", "B");     // overwrites U -> A with U -> B, A is now "unplugged"
    plugboard.addSetting("B", "S");     // overwrites B -> U with B -> S, U is now "unplugged"
    plugboard.addSetting("A", "T");
    plugboard.addSetting("A", "D");     // overwrites A -> T with A -> D, T is now "unplugged"
    expect(plugboard.settings).toEqual(new Map([
        ["P", "F"], ["F", "P"], ["B", "S"], ["S", "B"], ["A", "D"], ["D", "A"]
    ]));
});

test("convert returns the correct result", () => {
    const plugboard = new Plugboard();
    plugboard.addSetting("U", "A");
    const result = plugboard.convert("U");
    expect(result).toEqual("A");
});

test("convert returns the correct result in the reverse direction", () => {
    const plugboard = new Plugboard();
    plugboard.addSetting("U", "A");
    const result = plugboard.convert("A");
    expect(result).toEqual("U");
});

test("convert returns the same input if that letter is not set", () => {
    const plugboard = new Plugboard();
    plugboard.addSetting("U", "A");
    const result = plugboard.convert("R");
    expect(result).toEqual("R");
});

test("clearSettings removes all plugboard settings", () => {
    const plugboard = new Plugboard();
    plugboard.addSetting("U", "A");
    plugboard.addSetting("P", "F");
    plugboard.addSetting("R", "Q");
    plugboard.clearSettings();
    expect(plugboard.settings).toEqual(new Map());
});
