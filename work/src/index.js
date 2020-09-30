import hex from './hex';
import makeEscape from "./make-escape-table";
const surrogatePair = (c) => hex[0xF0 | ((c >> 18))] +
    hex[0x80 | ((c >> 12) & 0x3F)] +
    hex[0x80 | ((c >> 6) & 0x3F)] +
    hex[0x80 | ((c & 0x3F))];
const _createEncoder = (escape) => {
    return (str) => {
        const len = str.length;
        if (len === 0)
            return str;
        let o = '';
        let p = 0;
        for (let i = 0; i < len; i++) {
            const c = str.charCodeAt(i);
            if (c < 0x80 && escape[c] === 1)
                continue;
            if (p < i)
                o += str.slice(p, i);
            if (c < 0x80) {
                o += hex[c];
            }
            else if (c < 0x800) {
                o += hex[0xC0 | (c >> 6)] + hex[0x80 | (c & 0x3F)];
            }
            else if (c < 0xD800 || c >= 0xE000) {
                o += hex[0xE0 | (c >> 12)] + hex[0x80 | ((c >> 6) & 0x3F)] + hex[0x80 | (c & 0x3F)];
            }
            else if (++i < len) {
                // Surrogate pair
                o += surrogatePair(0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF)));
            }
            else
                throw new Error('Invalid Uri');
            p = i + 1;
        }
        return p === 0 ? str : p < len ? o + str.slice(p) : o;
    };
};
export function createUriEncoder(encode) {
    const e = _createEncoder(makeEscape(encode));
    Object.assign(e, { encodeSet: encode });
    return e;
}
export const encodeUri = createUriEncoder(' "#$%&+,/:;<=>?@[\\]^`{|}!\'()*');
export const stringify = createStringify(encodeUri);
export function createStringify(encoder) {
    function convert(v) {
        switch (typeof v) {
            case 'string':
                return encoder(v);
            case 'boolean':
                return v === true ? 'true' : 'false';
            case 'number':
                return v.toString(10);
            case 'object':
                return (v instanceof Date) ? encoder(v.toISOString()) : '';
            default:
                return '';
        }
    }
    return (obj) => {
        return Object
            .entries(obj)
            .map(kvp => {
            if (!Array.isArray(kvp[1]))
                return encoder(kvp[0]) + '=' + convert(kvp[1]);
            const attr = encoder(kvp[0]);
            kvp[1].map(v => attr + '=' + convert(v));
        })
            .join('&');
    };
}
console.log(stringify({ 'a': 123, 'b': 'abc!@£', e: true, f: false }));
//# sourceMappingURL=index.js.map