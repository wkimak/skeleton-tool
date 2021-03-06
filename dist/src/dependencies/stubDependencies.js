"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const regex_1 = require("../shared/regex");
const helpers_1 = require("../shared/helpers");
const excludedDirectories = {
    node_modules: true,
    dist: true,
    '.git': true
};
function findRootDirectory(currentDirectory) {
    const files = fs_1.default.readdirSync(currentDirectory);
    for (let file in files) {
        if (files[file] === 'package.json') {
            return currentDirectory;
        }
    }
    return findRootDirectory(path_1.default.dirname(currentDirectory));
}
exports.findRootDirectory = findRootDirectory;
function getStubPathAndExport(targetFileName, stubName, currentDirectory, projectRootDirectory) {
    const dependencyPath = searchFileSystem(targetFileName, projectRootDirectory);
    if (dependencyPath) {
        const content = fs_1.default.readFileSync(dependencyPath, 'utf8');
        // Make path separators consistent beetween Windows and Mac
        let relativePath = path_1.default.relative(currentDirectory, helpers_1.removePathExtension(dependencyPath)).split(path_1.default.sep).join('/');
        if (currentDirectory.split(path_1.default.sep).join('/') === path_1.default.dirname(dependencyPath).split(path_1.default.sep).join('/')) {
            relativePath = `./${relativePath}`;
        }
        if (!regex_1.isExportDefault.test(content)) {
            return { [relativePath]: { [stubName]: stubName } };
        }
        else {
            return { [relativePath]: { default: stubName } };
        }
    }
    else {
        console.log(`${targetFileName} file was not found. If you intended to use stub, your stub's file name must be the provider’s name with a suffix of ’Stub.ts’ (i.e. Router --> RouterStub.ts).`);
    }
}
function searchFileSystem(targetFileName, currentPath) {
    const files = fs_1.default.readdirSync(currentPath);
    for (const file in files) {
        const currentFile = currentPath + '/' + files[file];
        const stats = fs_1.default.statSync(currentFile);
        if (stats.isFile() && path_1.default.basename(currentFile).toLowerCase() === targetFileName.toLowerCase()) {
            return currentFile;
        }
        else if (stats.isDirectory() && !excludedDirectories.hasOwnProperty(path_1.default.basename(currentPath))) {
            const foundFile = searchFileSystem(targetFileName, currentFile);
            if (foundFile) {
                return foundFile;
            }
        }
    }
}
exports.searchFileSystem = searchFileSystem;
exports.default = getStubPathAndExport;
