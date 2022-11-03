"use strict";
const symCryptor = require( './index' );
symCryptor.rndBytes( 32 )
.then( result => {
    console.log( "32 Random bytes with 'symCryptor.rndBytes( 32 )'" );
    console.log( result );
    console.log( '' );
    return result;
} )
.then( hashKey => {
    const hmac = symCryptor.getHmac( 'Hello world!', hashKey );
    console.log( "KMAC256 of 'Hello world!' with 'symCryptor.getHmac( \"Hello world!\", secret )' and 32 Random bytes as secret" );
    console.log( hmac );
    console.log( '' );
    return hashKey;
} )
.then( hashKey => {
    symCryptor.rndBytes( 32 )
    .then( key => {
        symCryptor.encrypt( 'Hello world!', key, hashKey )
        .then( encrypted => {
            console.log( "Encrypted 'Hello world!' with 'symCryptor.encrypt( \"Hello world!\", key, hashKey )'" );
            console.log( encrypted );
            console.log( '' );
            symCryptor.decrypt( encrypted, key, hashKey )
            .then( decrypted => {
                console.log( "Decrypted 'Hello world!' with symCryptor.decrypt( encrypted, key, hashKey )" );
                console.log( decrypted.toString() );
                console.log( '' );
            } );
        } )
    } );
} );