
const ts = require('typescript');
/**
 * @param {import('typescript').ScriptTarget} target 
 * @param {boolean} setParentNode 
 */
module.exports = function TSParser(target, setParentNode) {

	const FRO = { // FunctionResultObject
		/**
 		 * @type {GetIOsResult}
 		 */
		getIOPropertyNames: { inputs: new Set(), outputs: new Set() }
	}

	/**
	 * @param {string} code
	 */
	function getSourceFileObject(code) {
		return ts.createSourceFile('temp.ts', code, target, setParentNode, ts.ScriptKind.TS);
	}

	/**
	 * @param {import('typescript').Node} node 
	 */
	function getIOPropertyNames(node) {
		if (ts.isPropertyDeclaration(node)) {
			const IOProperties = _getIOPropertyDecorators(node);
			Object.keys(FRO.getIOPropertyNames).forEach(key => { // key = 'input', 'output'
				IOProperties[key].forEach(io => FRO.getIOPropertyNames[key].add(_getIODecoratorNames(io, node)));
			});
		}
		ts.forEachChild(node, getIOPropertyNames);
	}

	/**
	 * @typedef {Object} GetIOsResult
	 * @property {Set<import('typescript').Decorator>} inputs
	 * @property {Set<import('typescript').Decorator>} outputs
	 */
	/**
	 * @param {import('typescript').Node} node
	 * @returns {GetIOsResult}
	 */
	function _getIOPropertyDecorators(node) {
		/**
		 * @type {GetIOsResult}
		 */
		const result = { inputs: new Set(), outputs: new Set() };
		node.decorators && node.decorators.forEach(decorator => {
			const fullText = decorator.getFullText().trim();
			if (/^@Input\(/.test(fullText)) {
				result.inputs.add(decorator);
			} else if (/^@Output\(/.test(fullText)) {
				result.outputs.add(decorator);
			}
		});
		return result;
	}

	/**
	 * @param {import('typescript').Decorator} io 
	 * @param {import('typescript').Node} node
	 * 
	 * @returns {string}
	 */

	function _getIODecoratorNames(io, node) {
		return getDecoratorArgs(io)[0] || node.name.getText();
	}

	/**
	 * @param {import('typescript').Decorator} decorator 
	 * @returns {string[]}
	 */
	function getDecoratorArgs(decorator) {
		/**
		 * @type {import('typescript').CallExpression}
		 */
		const expr = decorator.expression;
		return (expr && expr.arguments && expr.arguments.pos < expr.arguments.end) ? expr.arguments.map(a => (a.end > a.pos) && (a.getFullText().trim().replace(/\'|\"/g, ''))) : [''];
	}

	return {
		getSource: getSourceFileObject,
		/**
		 * @param {import('typescript').Node} ast 
		 */
		getIOs: function (ast) {
			FRO.getIOPropertyNames = { inputs: new Set(), outputs: new Set() };
			getIOPropertyNames(ast);
			return FRO.getIOPropertyNames;
		}
	};
};
