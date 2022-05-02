import { mask } from "maska";

function Mask(value: string, strmask: string) {
        return mask( value, strmask, {
            '#': { pattern: /[0-9]/ },
            'X': { pattern: /[0-9a-zA-Z]/ },
            'S': { pattern: /[a-zA-Z]/ },
            'A': { pattern: /[a-zA-Z]/, uppercase: true },
            'a': { pattern: /[a-zA-Z]/, lowercase: true },
            '!': { escape: true },
            '*': { repeat: true }
        })
}

export default Mask;