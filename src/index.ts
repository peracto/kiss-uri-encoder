import {createStringify, KissUriStringify} from './stringify'
import {createUriEncoder} from './create-encoder'

const encodeUri = createUriEncoder(' "#$%&+,/:;<=>?@[\\]^`{|}!\'()*')
const stringifyUriParams = createStringify(encodeUri)

function buildUrl (base:string, path:string, search:KissUriStringify) {
    const url = new URL(path, base)
    url.search = stringifyUriParams(search)
    return url.href
}

export {
    createUriEncoder,
    createStringify,
    encodeUri,
    stringifyUriParams,
    buildUrl
}



