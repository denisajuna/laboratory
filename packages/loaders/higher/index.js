const { join } = require('path');
const loaderUtils = require('loader-utils');

module.exports = function(origin) {
	const callback = this.async();
	// Options
	const { package, decorator, sourceDir } = loaderUtils.getOptions(this);
	// Array from resourcePath
	const resourceArrayPath = this.resourcePath.split('/');
	// Lookup array path
	const sourceDirIndex = sourceDir ? resourceArrayPath.indexOf(sourceDir) + 1 : resourceArrayPath.length - 1;
	const lastDirIndex = resourceArrayPath.length - 1;
	const lookup = resourceArrayPath.slice(sourceDirIndex, lastDirIndex).join('/');
	const fileName = resourceArrayPath[resourceArrayPath.length - 1];
	const path = join(lookup, fileName);
	const dataFilePath = join(package, path);
	
	this.loadModule(dataFilePath, (err) => {
		if (err) {
			console.error(`ERROR: @pyxis/loaders/higher: File doesn't exists on path: ${dataFilePath}. Fallback on origin one.\n`);
			callback(null, origin);
			return;
		}

		const result = `
			import wrapped from '${this.resourcePath}';
			import decorator from '${decorator}';
			import data from '${join(package, path)}';

			export default decorator(data)(wrapped);
		`;

		callback(null, result);
	});
}