(function (window, undefined) {

/**
 * EventHandler - Handles triggering and listening to the events of an entity.
 * @param {Object} entity - The entity to which the handler is attaching to.
 * @param {Array.<string>} events - An array of event names that this handler will use.
 * @constructor
 */
var EventHandler = function (entity, events) {
	this.entity = entity;
	this.events = { all: [] };
	if (events) {
		for (var i = 0, l = events.length; i < l; i++) {
			this.events[events[i]] = [];
		}
	}
	this.alias();
};

/**
 * Aliases triggering and listening methods onto the entity
 */
EventHandler.prototype.alias = function () {
	var self = this;

	this.entity.on = function (eventName, action, context) {
		self.on(eventName, action, context);
	};

	this.entity.once = function (eventName, action, context) {
		self.once(eventName, action, context);
	};

	this.entity.off = function (eventName, action, context) {
		self.off(eventName, action, context);
	};

	this.entity.trigger = function (eventName, args) {
		self.trigger(eventName, args);
	};
};

/**
 * Adds a listener to the entity for the specified event.
 * @param {!string} eventName - Name of event to attach listener to.
 * @param {!Function} action - The listener function to be trigger on event.
 * @param {Object} context - The scope that will be applied to the action.
 * @return {Object} The entity the handler is attached to.
 */
EventHandler.prototype.on = function (eventName, action, context) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push({ action: action, context: context || this.entity });
	return this.entity;
};

/**
 * Adds a listener to the entity for the specified event that will only fire once.
 * @param {!string} eventName - Name of event to attach listener to.
 * @param {!Function} action - The listener function to be trigger on event.
 * @param {Object} context - The scope that will be applied to the action.
 * @return {Object} The entity the handler is attached to.
 */
EventHandler.prototype.once = function (eventName, action, context) {
	var self = this,
	once = function () {
		self.off(eventName, once);
		action.apply(this, arguments);
	};
	once._action = action;
	return this.on(eventName, once, context);
};

/**
 * Removes alls listener from the entity. Removes all listeners on the enitity matching provided criteria.
 * @param {string} eventName - Name of event to remove listener from.
 * @param {Function} action - The listener function for the event.
 * @param {Object} context - The scope for the action.
 * @return {Object} The entity the handler is attached to.
 */
EventHandler.prototype.off = function (eventName, action, context) {
	if (!action && !context) {
		if (!eventName) {
			this.clear();
		} else {
			this.events[eventName] = [];
		}
		return this.entity;
	}
	var i, length, ev,
	events = this.events[eventName],
	retain = [];
	for (i = 0, length = events.length; i < length; i++) {
		ev = events[i];
		if ((action && action !== ev.action && action !== ev.action._action) ||
				(context && context !== ev.context)) {
			retain.push(ev);
		}
	}
	this.events[eventName] = retain;
	return this.entity;
};

/**
 * Trigger all listeners for the provided eventName.
 * @param {string} eventName - Name of event to trigger listeners for.
 * @param {?} argn - The nth value to be passed to the trigger listeners.
 * @return {Object} The entity the handler is attached to.
 */
EventHandler.prototype.trigger = function (eventName) {
	var shift = [].shift;
	shift.apply(arguments);

	if (this.events.hasOwnProperty(eventName)) {
		this.triggerEvents(this.events[eventName], arguments);
	}

	if (this.events.hasOwnProperty('all')) {
		this.triggerEvents(this.events.all, arguments);
	}

	return this.entity;
};

/**
 * Helper method for triggering events. Handles calling a list of listeners.
 * @param {Array.<Function>} events - The list of listeners to be called.
 * @param {Array} args - The list of arguments to be passed to each listener.
 * @private
 */
EventHandler.prototype.triggerEvents = function (events, args) {
	for (var i = 0, length = events.length; i < length; i++) {
		events[i].action.apply(events[i].context, args);
	}
};

/**
 * Helper method for clearing all events.
 * @private
 */
EventHandler.prototype.clear = function () {
	for (var key in this.events) {
		if (this.events.hasOwnProperty(key)) {
			this.events[key] = [];
		}
	}
};

/**
 * Global Variable Exports
 */
window.EventHandler = EventHandler;

}(typeof window !== 'undefined' ? window : this));
