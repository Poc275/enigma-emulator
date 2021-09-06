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
        setDisableSettings(true);

        const selectedReflector = document.getElementById("reflector-select").value;
        const reflector = new Reflector(selectedReflector);
        const lhsRotor = new Rotor(getRotorMapping(lhsSelectedRotor), lhsRotorPosition, parseInt(lhsRotorRingSetting, 10), getRotorStepPoints(lhsSelectedRotor));
        const midRotor = new Rotor(getRotorMapping(midSelectedRotor), midRotorPosition, parseInt(midRotorRingSetting, 10), getRotorStepPoints(midSelectedRotor));
        const rhsRotor = new Rotor(getRotorMapping(rhsSelectedRotor), rhsRotorPosition, parseInt(rhsRotorRingSetting, 10), getRotorStepPoints(rhsSelectedRotor));

        // get plugboard settings
        const plugboard = new Plugboard();
        const plugboardInputs = document.querySelectorAll(".plugboard-input");
        const plugboardSettingRegex = /[A-Z]{2}/g;
        for(const plugboardInput of plugboardInputs) {
          if(plugboardInput.value.match(plugboardSettingRegex)) {
            plugboard.addSetting(plugboardInput.value[0], plugboardInput.value[1]);
          }
        }

        const enigma = new Enigma(plugboard, new EntryRotor(), rhsRotor, midRotor, lhsRotor, reflector);
        setEngima(enigma);

        // call the setup callback so we can begin a new message
        props.setupCallback();
    };

    return (
        <div id="status">
            <div>
                <h1>Enigma Emulator</h1>
                <p>Setup the Enigma machine and click Start to begin your message. Click on the keys to type. See 
                  this <a href="http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages">wiki</a> for some example 
                  messages (<a href="http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Decrypts">decrypted versions available here</a>). Note 
                  this emulates a 3-rotor Enigma I/M3 machine.
                </p>

                <br />

                <p>
                  <label htmlFor="reflector-select">1. Choose a reflector: </label>
                  <select name="reflector" id="reflector-select" defaultValue={"B"} disabled={disableSettings}>
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

                <p>
                  <label htmlFor="plugboard-1">5. (optional) Enter plugboard settings (Up to 10 letter pairs which are swapped during message enciphering):</label>
                  <input type="text" id="plugboard-1" name="plugboard-1" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-2" name="plugboard-2" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-3" name="plugboard-3" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-4" name="plugboard-4" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-5" name="plugboard-5" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-6" name="plugboard-6" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-7" name="plugboard-7" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-8" name="plugboard-8" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-9" name="plugboard-9" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                  <input type="text" id="plugboard-10" name="plugboard-10" minLength="2" maxLength="2" size="2" disabled={disableSettings} className="plugboard-input"></input>
                </p>

                <button id="start" onClick={start} disabled={disableSettings}>6. Start!</button>
            </div>

            <div>
              <p>Message</p>
              <textarea id="input" name="input" rows="8" cols="45" disabled></textarea>
            </div>

            <div>
              <p>Output</p>
              <textarea id="output" name="output" rows="8" cols="45" disabled></textarea>
            </div>

            <small>Enigma model courtesy of <a href="https://sketchfab.com/3d-models/enigma-machine-1934-c8ee76c383654e3095ea4cc9e7990274">Enigma machine, 
                1934 by the Science Museum Group</a> licenced under CC BY-NC-SA 4.0.</small>
        </div>
    )
}

export default EnigmaSetup;