import ts, { Statement, ArrowFunction } from "typescript";

function getArrowFnTemplate(statements: any = []): ArrowFunction {
  return ts.createArrowFunction(
      undefined,
      undefined,
      [
          ts.createParameter(undefined, undefined, undefined, <any>ts.createToken(null), undefined, undefined, undefined)
      ],
      undefined,
      ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      ts.createBlock(statements, true)
  );
}

export default getArrowFnTemplate;
