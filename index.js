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

const getHmac = ( data, key, customization = '' ) => {
    return Buffer.from( new Uint8Array( kmac256.array( key, data, 512, customization ) ) );
};

const encrypt = async ( data, key, shaKey = undefined, customization = '' ) => {
    try {
        const iv = await rndBytes( 16 );
        const cipher = createCipheriv( 'aes-256-ctr', key, iv );
        let final = Buffer.concat( [cipher.update( data ), cipher.final(), iv] );
        if ( !shaKey ) return final;
        const hmac = getHmac( final, shaKey, customization )
        return Buffer.concat( [final, hmac] );
    } catch {
        throw new Error ( 'Invalid data' );
    }
};

const decrypt = async ( data, key, shaKey = undefined, customization = '' ) => {
    try {
        data = new Uint8Array( data );
        if ( shaKey ) {
            const mac = Buffer.from( data.slice( -64 ) ).toString( 'base64' );
            data = data.slice( 0, -64 );
            const realMac = getHmac( data, shaKey, customization ).toString( 'base64' );
            if ( realMac !== mac ) throw new Error ( 'Invalid data' );
        }
        const iv = data.slice( -16 );
        data = data.slice( 0, -16 )
        const cipher = createCipheriv( 'aes-256-ctr', key, iv );
        return Buffer.concat( [cipher.update( data ), cipher.final()] );
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