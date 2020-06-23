const ts = require('typescript');
const { tscode } = require('./data');

let code = process.argv[2] || tscode;


function getSourceFileObject(code) {
	return ts.createSourceFile('temp.ts', code, ts.ScriptTarget.ES2019, true, ts.ScriptKind.TS);
}

function getMethodDeclarationKindNode(node) {
	if (ts.isPropertyDeclaration(node)) {

		/* TODO: @sankarshanaj - extract input/output params by following below steps
			1. Start looping through node.decorators if present
				1a. If yes, get the node.decorators[i]?.expression.expression.text
				1b. If text is "Input" or "Output"
					1bi. if decorator[i] has arguments get that text
					1bj. Else get the node.name.text
				1c. Push the got text value to Result.["Input" or "Output"] array 
		*/
		console.log('node:', node);
	}
	ts.forEachChild(node, (n) => getMethodDeclarationKindNode(n));
}
const ast = getSourceFileObject(code);
getMethodDeclarationKindNode(ast);