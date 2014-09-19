exports.EntityEvent = (function (modules, undefined) {

	var EntityEvent = function (event, handler, data) {
		this.event = event;
		this.handler = handler;
		this.data = typeof data === 'object' ? data : {};
		this.propagate = true;
	};

	EntityEvent.prototype.getEvent = function () {
		return this.event;
	};

	EntityEvent.prototype.getHandler = function () {
		return this.handler;
	};

	EntityEvent.prototype.getEntity = function () {
		return this.handler.getEntity();
	};

	EntityEvent.prototype.getData = function (key) {
		if (this.data.hasOwnProperty(key)) {
			return this.data[key];
		}

		return undefined;
	};

	EntityEvent.prototype.isPropagated = function () {
		return this.setPropagate;
	};

	EntityEvent.prototype.stopPropagation = function () {
		this.propagate = false;
	};

	return EntityEvent;

})(exports);
