
/*********** {START - Initializations, Definitions} ************/
const ts = require('typescript');

/**
 * 
 * @param {import('typescript').ScriptTarget} target 
 * @param {boolean} setParentNode 
 */
module.exports = function TSParser(target, setParentNode) {

	const FRO = { // FunctionResultObject
		getIOPropertyNames: {}
	}
	/**
	 * @param {string} code
	 */
	function getSourceFileObject(code) {
		return ts.createSourceFile('temp.ts', code, target, setParentNode, ts.ScriptKind.TS);
	}

	/**
	 * 
	 * @param {import('typescript').Node} node 
	 */
	function getIOPropertyNames(node) {
		if (ts.isPropertyDeclaration(node)) {
			const IOProperties = _getIOPropertyDecorators(node);
			Object.keys(FRO.getIOPropertyNames).forEach(key => { // key = 'input', 'output'
				const v = IOProperties[key].map(io => _getIODecoratorNames(io, node));
				v.length && FRO.getIOPropertyNames[key].push(...v);
			});
		}
		ts.forEachChild(node, getIOPropertyNames);
	}

	/**
	 * @typedef {Object} result
	 * @property {Array<import('typescript').Decorator>} inputs
	 * @property {Array<import('typescript').Decorator>} outputs
	 */
	/**
	 * @param {import('typescript').Node} node
	 * @returns {result}
	 */
	function _getIOPropertyDecorators(node) {
		/**
		 * @type {result}
		 */
		const result = { inputs: [], outputs: [] };
		node.decorators && node.decorators.forEach(decorator => {
			const fullText = decorator.getFullText().trim();
			if (/^@Input\(/.test(fullText)) {
				result.inputs.push(decorator);
			} else if (/^@Output\(/.test(fullText)) {
				result.outputs.push(decorator);
			}
		});
		return result;
	}

	/**
	 * @param {import('typescript').Decorator} io 
	 * @param {import('typescript').Node} node 
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
		 * 
		 * @param {import('typescript').Node} ast 
		 */
		getIOs: function (ast) {
			FRO.getIOPropertyNames = { inputs: [], outputs: [] };
			getIOPropertyNames(ast);
			return FRO.getIOPropertyNames;
		}
	};
};

/*********** {END - Initializations, Definitions} ************/


