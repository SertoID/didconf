# didconf
An experimental CLI to generate a .well-known DID configuration for a domain.


## Installation
Using npm:
```shell
$ npm i -g didconf
```

## Usage
To create a new DID and generate the DID configuration for the domain `test.com`:
```shell
$ didconf test.com
```

To create a new DID from an Ethereum private key and generate the DID configuration for the domain `test.com`:
```shell
$ didconf test.com 8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f
```

Print the usage instructions by running:
```shell
$ didconf
```


## What is a DID configuration?
DID Configuration is a [draft spefication](https://identity.foundation/.well-known/resources/did-configuration/) being developed within the [Decentralized Identity Foundation (DIF)](https://identity.foundation/) and intended for registration with IANA as a [Well-Known resource](https://tools.ietf.org/html/rfc8615).

The DID Configuration resource provides proof of a bi-directional relationship between the controller of an origin and a DID via cryptographically verifiable signatures that are linked to a DID's key material. 

In more simple words, a DID configuration enables you trust a digital signature as belonging to an entity that owns an web domain. 

## What is a DID?

Decentralized Identifier (DID) is a new type of globally unique identifier defined by the W3C Decentralized Identifier Working Group in [this specification](https://www.w3.org/TR/did-core/). The DID specification is designed to enable individuals and organizations to generate their own identifiers using systems they trust. These new identifiers enable entities to prove control over them by authenticating using cryptographic proofs such as digital signatures. A DID identifies any subject (e.g., a person, organization, thing, data model, abstract entity, etc.) that the controller of the DID decides that it identifies.
