"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const arrowFunction_1 = __importDefault(require("../shared/arrowFunction"));
class Configuration {
    constructor(classNode, constructorParams, useMasterServiceStub) {
        this.classNode = classNode;
        this.constructorParams = constructorParams;
        this.useMasterServiceStub = useMasterServiceStub;
        useMasterServiceStub && this.getMasterServiceInit();
    }
    getMasterServiceInit() {
        return typescript_1.default.createVariableStatement(undefined, typescript_1.default.createVariableDeclarationList([typescript_1.default.createVariableDeclaration(typescript_1.default.createIdentifier('masterServiceStub'), typescript_1.default.createTypeReferenceNode(typescript_1.default.createIdentifier('MasterServiceStub'), undefined))], typescript_1.default.NodeFlags.Let));
    }
    generateStubs() {
        const stubs = [];
        this.constructorParams.forEach((param) => {
            const provider = param.type.typeName.text;
            let stubName;
            if (this.useMasterServiceStub) {
                stubName = `masterServiceStub.${provider.slice(0, 1).toLowerCase() + provider.slice(1)}Stub`;
            }
            else {
                stubName = provider + 'Stub';
            }
            stubs.push({ provider, class: stubName });
        });
        return stubs;
    }
    getProviderStubs(stubs) {
        const provide = typescript_1.default.createIdentifier('provide');
        const useClass = typescript_1.default.createIdentifier('useClass');
        return stubs.map(stub => {
            return typescript_1.default.createObjectLiteral([typescript_1.default.createPropertyAssignment(provide, typescript_1.default.createIdentifier(stub.provider)),
                typescript_1.default.createPropertyAssignment(useClass, typescript_1.default.createIdentifier(stub.class))]);
        });
    }
    getConfiguration(testBed) {
        const beforeEach = typescript_1.default.createIdentifier("beforeEach");
        const async = typescript_1.default.createIdentifier('async');
        const masterServiceStub = typescript_1.default.createIdentifier('masterServiceStub');
        const MasterServiceStub = typescript_1.default.createIdentifier('MasterServiceStub');
        const master = typescript_1.default.createExpressionStatement(typescript_1.default.createBinary(masterServiceStub, typescript_1.default.createToken(typescript_1.default.SyntaxKind.EqualsToken), typescript_1.default.createNew(MasterServiceStub, undefined, undefined)));
        const statements = this.useMasterServiceStub ? [master, testBed] : [testBed];
        const expression = typescript_1.default.createExpressionStatement(typescript_1.default.createCall(beforeEach, undefined, [typescript_1.default.createCall(async, undefined, [arrowFunction_1.default(statements)])]));
        return this.useMasterServiceStub ? [this.getMasterServiceInit(), expression] : [expression];
    }
}
exports.default = Configuration;
