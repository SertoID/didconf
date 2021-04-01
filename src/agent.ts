import {
    createAgent, IDataStore, IDIDManager, IKeyManager, IMessageHandler, IResolver, TAgent
} from '@veramo/core'
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import {
    DataStore, DataStoreORM, DIDStore, Entities, IDataStoreORM, KeyStore
} from '@veramo/data-store'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { DIDManager } from '@veramo/did-manager'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager } from '@veramo/key-manager'
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
import { MessageHandler } from '@veramo/message-handler'
import { Resolver } from 'did-resolver'
import { getResolver as getEthrResolver } from 'ethr-did-resolver'
import { createConnection } from 'typeorm'
import { DIDConfigurationPlugin, IWellKnownDidConfigurationPlugin } from 'veramo-plugin-did-config'

// @see https://github.com/uport-project/veramo/blob/next/__tests__/localAgent.test.ts

const databaseFile = 'local-database.sqlite'
const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
const secretKey = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'

let dbConnection: any = createConnection({
    type: 'sqlite',
    database: databaseFile,
    synchronize: true,
    logging: false,
    entities: Entities,
})

const ethrDidProvider = new EthrDIDProvider({
    defaultKms: "local",
    network: "mainnet",
    rpcUrl: `https://mainnet.infura.io/v3/${infuraProjectId}`,
    gas: 1000001,
    ttl: 60 * 60 * 24 * 30 * 12 + 1,
});


const resolver: Resolver = new Resolver({
    ...getEthrResolver(ethrDidProvider)
});

export let agent: TAgent<
    IDIDManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolver &
    IMessageHandler &
    ICredentialIssuer &
    IWellKnownDidConfigurationPlugin
> = createAgent<
    IDIDManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolver &
    IMessageHandler &
    ICredentialIssuer &
    IWellKnownDidConfigurationPlugin
>({
    context: {
        // authenticatedDid: 'did:example:3456'
    },
    plugins: [
        new KeyManager({
            store: new KeyStore(dbConnection, new SecretBox(secretKey)),
            kms: {
                local: new KeyManagementSystem()
            },
        }),
        new DIDManager({
            store: new DIDStore(dbConnection),
            defaultProvider: 'did:ethr',
            providers: {
                'did:ethr': ethrDidProvider
            },
        }),
        new DIDResolverPlugin({ resolver }),
        new DataStore(dbConnection),
        new DataStoreORM(dbConnection),
        new MessageHandler({
            messageHandlers: [
                new JwtMessageHandler(),
                new W3cMessageHandler(),
            ],
        }),
        new CredentialIssuer(),
        new DIDConfigurationPlugin(),
    ],
});
