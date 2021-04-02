import { createDidConfig } from "./didconfig";

describe('Create a DID configuration', () => {
    test('Using private key', async () => {
        const privateKey = "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
        const expectedDid = "did:ethr:0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377".toLowerCase();
        const didConfigData = await createDidConfig("test.com", privateKey);
        expect(didConfigData.identifier.did).toEqual(expectedDid);
        expect(didConfigData.privateKey).toEqual(privateKey);
        expect(didConfigData.didConfiguration.linked_dids.length).toEqual(1);
    });

    test('Without private key', async () => {
        const didConfigData = await createDidConfig("test.com");
        expect(didConfigData.privateKey!.length).toEqual(64);
        expect(didConfigData.identifier.did).toMatch(/^did:ethr:0x.{40}$/);
        expect(didConfigData.didConfiguration.linked_dids.length).toEqual(1);
    });
});