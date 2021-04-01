import { createDidConfig } from "./didconfig";
const fs = require('fs');
const colors = require('colors');
const yargs = require('yargs');

const argv = yargs
    .option('domain', {
        description: 'the domain to be linked to the DID',
        nargs: 1,
        alias: 'd',
        type: 'string',
        global: true
    })
    .option('privateKey', {
        description: 'the private key to be used in the signature',
        nargs: 1,
        alias: 'pk',
        type: 'string',
        global: true
    })
    .strict()
    .help()
    .argv;

const domain: string = argv.domain;
const privateKey: string = argv.privateKey;

createDidConfig(domain, privateKey).then(
    didConfiguration => {
        console.log(`DID:                   ${colors.bold.green(didConfiguration.identifier.did)}`);
        console.log(`Private key:           ${colors.bold.red(didConfiguration.privateKey)}`);
        console.log("DID Configuration URL: " + colors.bold.green("https://" + domain + "/.well-known/did-configuration.json"));

        const wkDidConfigContent = JSON.stringify(didConfiguration.didConfiguration, null, 4);
        console.log("DID Configuration file \"did-configuration.json\":\n" + colors.bold.gray(wkDidConfigContent));

        fs.writeFile("did-configuration.json", wkDidConfigContent, (err: any) => {
            if (err) console.log(colors.bold.red("Copy the content above and upload to the URL informed."));
        });
    }
)
    .catch(e => {
        console.log(e);
    });

