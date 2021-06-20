import Utility from "../Utility";

test.each`
letter | expected
${"A"} | ${0}
${"B"} | ${1}
${"L"} | ${11}
${"Q"} | ${16}
${"V"} | ${21}
${"Z"} | ${25}
`("getCharacterCode returns $expected when letter is $letter", ({letter, expected}) => {
    const letterPos = Utility.getCharacterCode(letter);
    expect(letterPos).toEqual(expected);
});

test.each`
code   | expected
${65}  | ${"A"}
${67}  | ${"C"}
${74}  | ${"J"}
${78}  | ${"N"}
${83}  | ${"S"}
${88}  | ${"X"}
`("getCharacterFromCode returns $expected when character code is $code", ({code, expected}) => {
    const character = Utility.getCharacterFromCode(code);
    expect(character).toEqual(expected);
});

test.each`
value | modulus | expected
${0}  | ${26}   | ${0}
${1}  | ${26}   | ${1}
${2}  | ${26}   | ${2}
${25} | ${26}   | ${25}
${26} | ${26}   | ${0}
`("getModulo returns $expected when value is $value with modulus $modulus", ({value, modulus, expected}) => {
    const modulo = Utility.getModulo(value, modulus);
    expect(modulo).toEqual(expected);
});

test.each`
letter | shift | expected
${"A"} | ${1}  | ${"B"}
${"Z"} | ${1}  | ${"A"}
${"C"} | ${2}  | ${"E"}
${"Y"} | ${2}  | ${"A"}
${"I"} | ${5}  | ${"N"}
${"W"} | ${5}  | ${"B"}
`("getShiftedLetter returns $expected when input letter is $letter with a shift of $shift", ({letter, shift, expected}) => {
    const shiftedLetter = Utility.getShiftedLetter(letter, shift);
    expect(shiftedLetter).toEqual(expected);
});

test.each`
inPos    | outPos  | expected
${"A"}   | ${"A"}  | ${0}
${"A"}   | ${"B"}  | ${1}
${"B"}   | ${"A"}  | ${25}
${"B"}   | ${"D"}  | ${2}
${"A"}   | ${"Z"}  | ${25}
${"W"}   | ${"D"}  | ${7}
${"D"}   | ${"W"}  | ${19}
`("getRelativeOffset returns $expected when input position is $inPos and output position is $outPos", ({inPos, outPos, expected}) => {
    const offset = Utility.getRelativeOffset(inPos, outPos);
    expect(offset).toEqual(expected);
});