	/**
	 * Global Exports
	 */
	var i, numExports, exportClasses = ['EventHandler', 'EventListener', 'EntityEvent'];

	for (i = 0, numExports = exportClasses.length; i < numExports; i++) {
		if (typeof global[exportClasses[i]] !== 'undefined') {
			exports[exportClasses[i]]['_existing'] = global[exportClasses[i]];
		}

		global[exportClasses[i]] = exports[exportClasses[i]];
	}

}(typeof window !== 'undefined' ? window : this));
