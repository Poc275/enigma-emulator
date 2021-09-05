import './EnigmaSetup.css';
import Rotor from "./enigma/Rotor";
import Enigma from "./enigma/Enigma";
import Plugboard from "./enigma/Plugboard";
import EntryRotor from "./enigma/EntryRotor";
import Reflector from "./enigma/Reflector";
import RotorSelect from './RotorSelect';
import PositionSelect from './PositionSelect';
import RingSettingSelect from './RingSettingSelect';
import { useEffect, useState } from 'react';

function EnigmaSetup(props) {
    // rotor mappings constants
    const rotorIMapping = ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"];
    const rotorIIMapping = ["A", "J", "D", "K", "S", "I", "R", "U", "X", "B", "L", "H", "W", "T", "M", "C", "Q", "G", "Z", "N", "P", "Y", "F", "V", "O", "E"];
    const rotorIIIMapping = ["B", "D", "F", "H", "J", "L", "C", "P", "R", "T", "X", "V", "Z", "N", "Y", "E", "I", "W", "G", "A", "K", "M", "U", "S", "Q", "O"];
    const rotorIVMapping = ["E", "S", "O", "V", "P", "Z", "J", "A", "Y", "Q", "U", "I", "R", "H", "X", "L", "N", "F", "T", "G", "K", "D", "C", "M", "W", "B"];
    const rotorVMapping = ["V", "Z", "B", "R", "G", "I", "T", "Y", "U", "P", "S", "D", "N", "H", "L", "X", "A", "W", "M", "J", "Q", "O", "F", "E", "C", "K"];
    const rotorVIMapping = ["J", "P", "G", "V", "O", "U", "M", "F", "Y", "Q", "B", "E", "N", "H", "Z", "R", "D", "K", "A", "S", "X", "L", "I", "C", "T", "W"];
    const rotorVIIMapping = ["N", "Z", "J", "H", "G", "R", "C", "X", "M", "Y", "S", "W", "B", "O", "U", "F", "A", "I", "V", "L", "P", "E", "K", "Q", "D", "T"];
    const rotorVIIIMapping = ["F", "K", "Q", "H", "T", "L", "X", "O", "C", "B", "J", "S", "P", "D", "Z", "R", "A", "M", "E", "W", "N", "I", "U", "Y", "G", "V"];

    const [lhsSelectedRotor, setLhsSelectedRotor] = useState("I");
    const [midSelectedRotor, setMidSelectedRotor] = useState("II");
    const [rhsSelectedRotor, setRhsSelectedRotor] = useState("III");
    const [lhsRotorPosition, setLhsRotorPosition] = useState("A");
    const [midRotorPosition, setMidRotorPosition] = useState("A");
    const [rhsRotorPosition, setRhsRotorPosition] = useState("A");
    const [lhsRotorRingSetting, setLhsRotorRingSetting] = useState("1");
    const [midRotorRingSetting, setMidRotorRingSetting] = useState("1");
    const [rhsRotorRingSetting, setRhsRotorRingSetting] = useState("1");
    const [disableSettings, setDisableSettings] = useState(false);
    const [enigma, setEngima] = useState(null);

    // key press hook from Enigma3d
    useEffect(() => {
        if(props.keyPress) {
            // console.log(props.keyPress);
            const result = enigma.encipher(props.keyPress);
            document.getElementById("input").textContent += `${props.keyPress}`;
            document.getElementById("output").textContent += `${result}`;
        }
    }, [props.keyPress]);

    const rotorSelectionChange = (event, rotor) => {
        // console.log(event.target.value);
        // console.log(rotor);
        switch(rotor) {
          case "lhs":
            setLhsSelectedRotor(event.target.value);
            break;
    
          case "mid":
            setMidSelectedRotor(event.target.value);
            break;
    
          case "rhs":
            setRhsSelectedRotor(event.target.value);
            break;
        }
    };
    
    const rotorPositionChange = (event, rotor) => {
        // console.log(event.target.value);
        switch(rotor) {
            case "lhs":
            setLhsRotorPosition(event.target.value);
            break;

            case "mid":
            setMidRotorPosition(event.target.value);
            break;

            case "rhs":
            setRhsRotorPosition(event.target.value);
            break;
        }
    };
    
    const rotorRingSettingChange = (event, rotor) => {
        // console.log(event.target.value);
        switch(rotor) {
          case "lhs":
            setLhsRotorRingSetting(event.target.value);
            break;
    
          case "mid":
            setMidRotorRingSetting(event.target.value);
            break;
    
          case "rhs":
            setRhsRotorRingSetting(event.target.value);
            break;
        }
    };
    
    const getRotorMapping = (rotorId) => {
        switch(rotorId) {
          case "I":
            return rotorIMapping;
    
          case "II":
            return rotorIIMapping;
    
          case "III":
            return rotorIIIMapping;
    
          case "IV":
            return rotorIVMapping;
    
          case "V":
            return rotorVMapping;
    
          case "VI":
            return rotorVIMapping;
    
          case "VII":
            return rotorVIIMapping;
    
          case "VIII":
            return rotorVIIIMapping;
    
          default:
            return rotorIMapping;
        }
    };
    
    const getRotorStepPoints = (rotorId) => {
        switch(rotorId) {
          case "I":
            return ["R"];
    
          case "II":
            return ["F"];
    
          case "III":
            return ["W"];
    
          case "IV":
            return ["K"];
    
          case "V":
            return ["A"];
    
          case "VI":
            return ["A, N"];
    
          case "VII":
            return ["A, N"];
    
          case "VIII":
            return ["A, N"];
    
          default:
            return ["R"];
        }
    };

    const start = () => {
        // lock-in the enigma settings
        props.setupCallback();

        document.getElementById("reflector-select").disabled = true;
        setDisableSettings(true);

        const selectedReflector = document.getElementById("reflector-select").value;
        const reflector = new Reflector(selectedReflector);
        const lhsRotor = new Rotor(getRotorMapping(lhsSelectedRotor), lhsRotorPosition, parseInt(lhsRotorRingSetting, 10), getRotorStepPoints(lhsSelectedRotor));
        const midRotor = new Rotor(getRotorMapping(midSelectedRotor), midRotorPosition, parseInt(midRotorRingSetting, 10), getRotorStepPoints(midSelectedRotor));
        const rhsRotor = new Rotor(getRotorMapping(rhsSelectedRotor), rhsRotorPosition, parseInt(rhsRotorRingSetting, 10), getRotorStepPoints(rhsSelectedRotor));

        const enigma = new Enigma(new Plugboard(), new EntryRotor(), rhsRotor, midRotor, lhsRotor, reflector);
        setEngima(enigma);
    };

    return (
        <div id="status">
            <div>
                <h1>Enigma Emulator</h1>
                <p>Setup the Enigma machine and click Start to begin your message. Click on the keys to type your message.</p>

                <p>
                    <label htmlFor="reflector-select">1. Choose a reflector: </label>
                    <select name="reflector" id="reflector-select" defaultValue={"B"}>
                        <option value="A">Reflector A</option>
                        <option value="B">Reflector B</option>
                    </select>
                </p>

                <p>
                    <label htmlFor="lhs-rotor-select">2. Choose a left hand rotor/start position/ring setting: </label>
                    <RotorSelect defaultValue={lhsSelectedRotor} onChange={(event) => rotorSelectionChange(event, "lhs")} disabled={disableSettings} />
                    <PositionSelect defaultValue={lhsRotorPosition} onChange={(event) => rotorPositionChange(event, "lhs")} disabled={disableSettings} />
                    <RingSettingSelect defaultValue={lhsRotorRingSetting} onChange={(event) => rotorRingSettingChange(event, "lhs")} disabled={disableSettings} />
                </p>

                <p>
                    <label htmlFor="middle-rotor-select">3. Choose a middle rotor/start position/ring setting: </label>
                    <RotorSelect defaultValue={midSelectedRotor} onChange={(event) => rotorSelectionChange(event, "mid")} disabled={disableSettings} />
                    <PositionSelect defaultValue={midRotorPosition} onChange={(event) => rotorPositionChange(event, "mid")} disabled={disableSettings} />
                    <RingSettingSelect defaultValue={midRotorRingSetting} onChange={(event) => rotorRingSettingChange(event, "mid")} disabled={disableSettings} />
                </p>

                <p>
                    <label htmlFor="rhs-rotor-select">4. Choose a right hand rotor/start position/ring setting: </label>
                    <RotorSelect defaultValue={rhsSelectedRotor} onChange={(event) => rotorSelectionChange(event, "rhs")} disabled={disableSettings} />
                    <PositionSelect defaultValue={rhsRotorPosition} onChange={(event) => rotorPositionChange(event, "rhs")} disabled={disableSettings} />
                    <RingSettingSelect defaultValue={rhsRotorRingSetting} onChange={(event) => rotorRingSettingChange(event, "rhs")} disabled={disableSettings} />
                </p>

                <button id="start" onClick={start}>5. Start!</button>
            </div>

            <div>
                <p>Message</p>
                <textarea id="input" name="input" rows="10" cols="35" disabled></textarea>
            </div>

            <div>
                <p>Output</p>
                <textarea id="output" name="output" rows="10" cols="35" disabled></textarea>
            </div>

            <p>Enigma model courtesy of <a href="https://sketchfab.com/3d-models/enigma-machine-1934-c8ee76c383654e3095ea4cc9e7990274">Enigma machine, 
                1934 by the Science Museum Group</a> licenced under CC BY-NC-SA 4.0.</p>
        </div>
    )
}

export default EnigmaSetup;