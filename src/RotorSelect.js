function RotorSelect(props) {
    return (
        <select defaultValue={props.defaultValue} onChange={props.onChange} disabled={props.disabled}>
            <option value="I">Rotor I</option>
            <option value="II">Rotor II</option>
            <option value="III">Rotor III</option>
            <option value="IV">Rotor IV</option>
            <option value="V">Rotor V</option>
            <option value="VI">Rotor VI</option>
            <option value="VII">Rotor VII</option>
            <option value="VIII">Rotor VIII</option>
        </select>
    );
}

export default RotorSelect;