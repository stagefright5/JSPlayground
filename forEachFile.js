// @ts-check
const path = require('path');
const { promises: fs } = require("fs");
const { exec } = require('child_process');
const { resolve } = require('path');

async function getFiles(path = "./", cb) {
	const entries = await fs.readdir(path, { withFileTypes: true });

	// Get files within the current directory and add a path key to the file objects
	const files = entries
		.filter(file => !file.isDirectory())
		.map(file => ({ ...file, path: path + file.name }))

	// Get folders within the current directory
	const folders = entries.filter(folder => folder.isDirectory());
	for (const f of files) {
		cb(f);
	}
	for (const folder of folders)
		/*
		  Add the found files within the subdirectory to the files array by calling the
		  current function itself
		*/
		files.push(...await getFiles(`${path}${folder.name}/`, cb));

	return files;
}

getFiles('D:/work/bhive-ad/src/app/', (f) => {
	return new Promise((res, rej) => {
		if (f.name.endsWith('.scss')) {
			const parent = path.resolve(f.path, '..');
			// console.log(parent)
			exec(`sass-migrator module --verbose --migrate-deps ${f.name}`, {
				cwd: parent,
			}, (err, stdout, stderr) => {
				if (err) {
					console.error('err:: ', err);
					return res(err);
				}
				if (stdout) {
					console.log('stdout:: ', stdout);
					return res(stdout)
				}
				if (stderr) {
					console.log('stderr:: ', stderr);
					return res(stderr)
				}
			})
		} else {
			resolve();
		}
	})
});