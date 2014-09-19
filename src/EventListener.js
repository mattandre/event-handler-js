exports.EventListener = (function (modules, undefined) {

	var EventListener = function (event, handler, action, context) {
		this.event = event;
		this.handler = handler;
		this.action = action;
		this.context = context || handler.getEntity();
	};

	EventListener.prototype.getEvent = function () {
		return this.event;
	};

	EventListener.prototype.getHandler = function () {
		return this.handler;
	};

	EventListener.prototype.getEntity = function () {
		return this.handler.getEntity();
	};

	EventListener.prototype.getAction = function () {
		return this.action;
	};

	EventListener.prototype.getContext = function () {
		return this.context;
	};

	EventListener.prototype.trigger = function (entityEvent) {
		if (!this.isPropagated()) {
			return false;
		}

		this.action.call(this.context, entityEvent);
	};

	EventListener.prototype.matches = function (action, context) {
		return (!action || action === this.action || action === this.action._action) &&
					(!context || context === this.context);
	};

	return EventListener;

})(exports);
