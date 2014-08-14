exports.EntityEvent = (function () {

	var EntityEvent = function (event, handler, data) {
		this.event = event;
		this.handler = handler;
		this.data = typeof data === 'object' ? data : {};
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

	return EntityEvent;

})(exports);
