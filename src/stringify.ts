export declare type KissUriBaseType = string|number|boolean
export declare type KissUriStringify = {[key:string]:KissUriBaseType|KissUriBaseType[]}

export function createStringify(encoder:(str:string)=>string) {
    function convert(v: KissUriBaseType) {
        switch (typeof v) {
            case 'string':
                return encoder(v)
            case 'boolean':
                return v === true ? 'true' : 'false'
            case 'number':
                return v.toString(10)
            default:
                return ''
        }
    }

    return (obj: KissUriStringify) => Object
        .entries(obj && typeof obj==='object'?obj:{})
        .map(kvp => (!Array.isArray(kvp[1]))
            ? encoder(kvp[0]) + '=' + convert(kvp[1])
            : outputArray(encoder(kvp[0]), kvp[1], convert)
        )
        .join('&')
}

const outputArray = (attr:string,arr:KissUriBaseType[], convert:(t:KissUriBaseType) => string) =>
    arr.map(v => attr + '=' + convert(v)).join('&')
