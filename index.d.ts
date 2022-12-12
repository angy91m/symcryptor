export function rndBytes(length: any, bytes?: boolean): any;
export function getHmac(data: any, key: any, customization?: string, bytes?: boolean): any;
export function encrypt(data: any, key: any, hashKey?: any, customization?: string, bytes?: boolean): Promise<any>;
export function decrypt(data: any, key: any, hashKey?: any, customization?: string, bytes?: boolean): Promise<any>;
