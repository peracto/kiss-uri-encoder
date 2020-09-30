export interface KissUriEncoder {
    (str: string): string;
    readonly encodeSet: string;
}
export declare function createUriEncoder(encode: string): KissUriEncoder;
export declare const encodeUri: KissUriEncoder;
export declare const stringify: (obj: KissUriStringify) => string;
export declare type KissUriBaseType = string | number | boolean;
export declare type KissUriStringify = {
    [key: string]: KissUriBaseType | KissUriBaseType[];
};
export declare function createStringify(encoder: (str: string) => string): (obj: KissUriStringify) => string;
//# sourceMappingURL=index.d.ts.map