
import program from 'commander';
import { createDidConfig } from "./didconfig";
const fs = require('fs');
const colors = require('colors');
const yargs = require('yargs');
const { description, version } = require('../package.json')

program
    .description(description)
    .version(version, '-v, - version')
    .arguments('<domain> [privateKey]')
    .description('Creates a DID configuration for a domain', {
        domain: 'The domain to be linked to an Ethr-DID',
        privateKey: 'Private key of your Ethr-DID in case you don\'t want a new DID to be created.'
    })
    .action((domain, privateKey) => {
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
    })
    .helpOption('-h, --help', 'Command instructions');

if (process.argv.length === 2) process.argv.push('-h')
program.parse(process.argv);
