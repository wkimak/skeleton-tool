#!/usr/bin/env node
import '../polyfills'
import ts, { SourceFile, Printer } from 'typescript';
import fs from 'fs';
import prettier from 'prettier';
import argv from 'yargs';
import { ComponentSpecBuilder } from './builders/ComponentSpecBuilder';
import { ServiceSpecBuilder } from './builders/ServiceSpecBuilder';

const terminal = argv.usage('Usage: $0 <command> [options]')
  .command('build', 'Build test file')
  .example('$0 build -f app.component.ts', 'build test file for app.component.ts')
  .option('f', {
    alias: 'file',
    demandOption: true,
    nargs: 1,
    describe: 'Load a File',
    type: 'string'
  })
  .option('m', {
    alias: 'master',
    demandOption: false,
    nargs: 0,
    describe: 'Use MasterServiceStub',
  })
  .help('h')
  .alias('h', 'help').argv;


function writeFile(fileName: string, data: string): void {
  fs.writeFile(fileName, prettier.format(data, { parser: 'babel' }), (err) => {
    console.error('ERROR', err);
  });
}

const useMasterServiceStub: boolean = terminal.master;
const specFileName: string = terminal.file.split('.').slice(0, -1).join('.') + '.spec.ts';
const specPath: string = `${process.cwd()}/${specFileName}`;

if (!fs.existsSync(specPath)) {
  const created: SourceFile = new ServiceSpecBuilder(terminal.file, specFileName, useMasterServiceStub).targetFile;
  const printer: Printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  writeFile(specFileName, printer.printFile(created));
}

