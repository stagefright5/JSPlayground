const { tscode } = require('../data');
const TSParser = require('../tsparser');
const ts = require('typescript');
const code = process.argv[2] || tscode; // pass "code" string as argument or fallback to thr `data.tscode`

const TSP = TSParser(ts.ScriptTarget.ES2019, true);

const ast = TSP.getSource(code);

const res = TSP.getIOs(ast);

console.log(res);
