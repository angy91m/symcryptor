'use strict';

const { createCipheriv, randomBytes } = require( 'node:crypto' );
const { kmac256 } = require( 'js-sha3' );

const rndBytes = ( length, bytes = false ) => {
    return new Promise( ( resolve, reject ) => {
        randomBytes( length, ( err, buff ) => {
            if ( err ) { reject( err ) };
            if ( !bytes ) resolve( buff );
            resolve( new Uint8Array( buff ) );
        } );
    } );
};

const getHmac = ( data, key, customization = '', bytes = false ) => {
    const arr = new Uint8Array( kmac256.array( key, data, 512, customization ) );
    if ( bytes ) return arr;
    return Buffer.from( arr );
};

const encrypt = async ( data, key, hashKey = undefined, customization = '', bytes = false ) => {
    try {
        const iv = await rndBytes( 16 );
        const cipher = createCipheriv( 'aes-256-ctr', key, iv );
        let final = Buffer.concat( [cipher.update( data ), cipher.final(), iv] );
        if ( !hashKey ) {
            if ( !bytes ) return final;
            return new Uint8Array( final );
        }
        const hmac = getHmac( final, hashKey, customization );
        final = Buffer.concat( [final, hmac] );
        if ( !bytes ) return final;
        return new Uint8Array( final );
    } catch {
        throw new Error ( 'Invalid data' );
    }
};

const decrypt = async ( data, key, hashKey = undefined, customization = '', bytes = false ) => {
    try {
        data = new Uint8Array( data );
        if ( hashKey ) {
            const mac = Buffer.from( data.slice( -64 ) ).toString( 'base64' );
            data = data.slice( 0, -64 );
            const realMac = getHmac( data, hashKey, customization ).toString( 'base64' );
            if ( realMac !== mac ) throw new Error ( 'Invalid data' );
        }
        const iv = data.slice( -16 );
        data = data.slice( 0, -16 )
        const cipher = createCipheriv( 'aes-256-ctr', key, iv );
        const buff = Buffer.concat( [cipher.update( data ), cipher.final()] );
        if ( !bytes ) return buff;
        return new Uint8Array( buff );
    } catch {
        throw new Error ( 'Invalid data' );
    }
};

module.exports = {
    rndBytes,
    getHmac,
    encrypt,
    decrypt
};