class Reflector {

    constructor() {
        this._reflectorB = new Map([
            ["A", "Y"], ["B", "R"], ["C", "U"], ["D", "H"], ["E", "Q"], ["F", "S"], ["G", "L"], ["H", "D"], ["I", "P"], ["J", "X"], ["K", "N"], ["L", "G"], ["M", "O"], 
            ["N", "K"], ["O", "M"], ["P", "I"], ["Q", "E"], ["R", "B"], ["S", "F"], ["T", "Z"], ["U", "C"], ["V", "W"], ["W", "V"], ["X", "J"], ["Y", "A"], ["Z", "T"]
        ]);
    }

    reflect(input) {
        return this._reflectorB.get(input);
    }
}

export default Reflector;