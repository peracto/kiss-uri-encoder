'use strict'
import hex from './hex'
import makeEscape from "./make-escape-table";

export interface KissUriEncoder {
    (str: string): string,
    readonly encodeSet: string
}

const _createEncoder = (escape:number[])  => {
    return (str: string) => {
        const len = str.length

        if (len === 0) return str

        let o = ''
        let p = 0

        for (let i = 0; i < len; i++) {
            const c = str.charCodeAt(i)
            if (c < 0x80 && escape[c] === 1) continue

            if (p < i) o += str.slice(p, i)

            if (c < 0x80) { // 1 byte
                o += hex[c]
            } else if (c < 0x800) { // 2 byte Utf-8
                o += hex[0xC0 | (c >> 6)] + hex[0x80 | (c & 0x3F)]
            } else if (c < 0xD800 || c >= 0xE000) { // 3 bytes Utf-8
                o += hex[0xE0 | (c >> 12)] + hex[0x80 | ((c >> 6) & 0x3F)] + hex[0x80 | (c & 0x3F)]
            } else if (++i < len) { // 4 byte utf-8 - decoded from utf-16 - bottom 10 bits - producing 21 bit UCS character
                o += surrogatePair(0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF)))
            } else throw new Error('Invalid Uri')

            p = i + 1
        }
        return p === 0 ? str : p < len ? o + str.slice(p) : o
    }
}

export function createUriEncoder (encode:string) {
    const e = _createEncoder(makeEscape(encode))
    Object.assign(e, {encodeSet: encode})
    return e as KissUriEncoder
}

const surrogatePair = (c:number) =>
    hex[0xF0 | ((c >> 18))] +
    hex[0x80 | ((c >> 12) & 0x3F)] +
    hex[0x80 | ((c >> 6) & 0x3F)] +
    hex[0x80 | ((c & 0x3F))]

