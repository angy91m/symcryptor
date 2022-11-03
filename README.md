# SymCryptor

SymCryptor allows you to easy use a symmetric encryption (with AES-CTR-256) and a signature method (with KMAC-256).

## Installation

```bash
npm i symcryptor
```

## Test
```bash
npm test
```

## Usage

```javascript
const symCryptor = require( 'symcryptor' );
( async () => {
    const clearText = 'Hello world!';

    // For hashing
    const hashSecret = await symCryptor.rndBytes( 32 ); // Return a random 256-bit Buffer
    const digest = symCryptor.getHmac( clearText, hashSecret ); // Return a 512-bit Buffer as digest

    // For encryption
    const key = await symCryptor.rndBytes( 32 ); // Key must be a Buffer or Uint8Array of 512-bit
    const encrypted = await symCryptor.encrypt( clearText, key, hashSecret ); // Return a Buffer

    // For decryption
    const decrypted = await symCryptor.decrypt( clearText, key, hashSecret ); // Return a Buffer
} )();
```

## Methods

### `symCryptor.rndBytes`
```javascript
symCryptor.rndBytes( length: Number [, bytes: Boolean = false] )
```

#### Parameters

* `length` Required - The length of random data in bytes
* `bytes` Optional - If `true` return `Uint8Array` instead of `Buffer` on fulfillment

#### Return

`Buffer | Uint8Array` when `Promise` resolved else throw an `Error`

### `symCryptor.getHmac`
```javascript
symCryptor.getHmac( data: String | Buffer | Uint8Array, key: Buffer | Uint8Array [, customization: String = '' [, bytes: Boolean = false]] )
```

#### Parameters

* `data` Required - The data you want hash
* `key` Required - The secret key (it should be of 256-bit)
* `customization` Optional - A string you want to pass to hash algorithm (like AAD in AES-GCM)
* `bytes` Optional - If `true` return `Uint8Array` instead of `Buffer`

#### Return

`Buffer | Uint8Array` else throw an `Error`

### `symCryptor.encrypt`
```javascript
symCryptor.encrypt( data: String | Buffer | Uint8Array, key: Buffer | Uint8Array [, hashKey: Buffer | Uint8Array [, customization: String = '' [, bytes: Boolean = false]]] )
```

#### Parameters

* `data` Required - The data you want to encrypt
* `key` Required - The key you want to use for encryption (it must be of 256-bit)
* `hashKey` Optional - The key you want to use to sign encrypted data
* `customization` Optional - A string you want to pass to hash algorithm (like AAD in AES-GCM)
* `bytes` Optional - If `true` return `Uint8Array` instead of `Buffer` on fulfillment

#### Return

`Buffer | Uint8Array` when `Promise` resolved else throw an `Error`

### `symCryptor.decrypt`
```javascript
symCryptor.decrypt( data: Buffer | Uint8Array, key: Buffer | Uint8Array [, hashKey: Buffer | Uint8Array [, customization: String = '' [, bytes: Boolean = false]]] )
```

#### Parameters

* `data` Required - The encrypted data you want to decrypt
* `key` Required - The key you have to use for decryption (it must be of 256-bit)
* `hashKey` Optional - The key you have to use to verify signature of encrypted data (required if data was signed)
* `customization` Optional - A string you have to pass to hash algorithm (like AAD in AES-GCM; required if it was passed during encryption)
* `bytes` Optional - If `true` return `Uint8Array` instead of `Buffer` on fulfillment

#### Return

`Buffer | Uint8Array` when `Promise` resolved else throw an `Error`