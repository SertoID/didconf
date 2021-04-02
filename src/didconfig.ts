import { IIdentifier, IKey } from "@veramo/core";
import { IDidConfigurationSchema } from "veramo-plugin-did-config";
import { agent } from "./agent";
import { keccak_256 } from 'js-sha3'
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

export class DidConfiguration {
    identifier!: IIdentifier;
    privateKey?: string;
    didConfiguration!: IDidConfigurationSchema;
}

function toEthereumAddress(hexPublicKey: string): string {
    return `0x${Buffer.from(keccak_256.arrayBuffer(Buffer.from(hexPublicKey.slice(2), 'hex')))
        .slice(-20)
        .toString('hex')}`
}

export const createDidConfig = async (domain: string, privateKey?: string): Promise<DidConfiguration> => {
    // console.log(secp256k1);
    const key = secp256k1.keyFromPrivate(privateKey);
    let identifier: IIdentifier;
    if (privateKey) {
        identifier = await agent.didManagerImport({
            did: "did:ethr:" + toEthereumAddress(key.getPublic().encode('hex')),
            provider: "did:ethr",
            keys: [
                {
                    "type": "Secp256k1",
                    "kms": "local",
                    "kid": key.getPublic().encode('hex'),
                    publicKeyHex: key.getPublic().encode('hex'),
                    privateKeyHex: privateKey
                }
            ],
            services: []
        });
    }
    else {
        identifier = await agent.didManagerCreate({});
        const key: IKey = await agent.keyManagerGet({ kid: identifier.keys[0].kid });
        privateKey = key.privateKeyHex;
    }

    const didConfiguration = await agent.generateDidConfiguration({ domain, dids: [identifier.did] });

    return { identifier, privateKey, didConfiguration };
}
