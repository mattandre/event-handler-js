exports.EventHandler = (function (modules, undefined) {

	/**
	 * EventHandler - Handles triggering and listening to the events of an entity.
	 * @param {Object} entity - The entity to which the handler is attaching to.
	 * @param {Array.<string>} events - An array of event names that this handler will use.
	 * @constructor
	 */
	var EventHandler = function (entity, events) {
		this.entity = entity;
		this.listeners = { all: [] };

		if (events && events.length > 0) {
			for (var i = 0, length = events.length; i < length; i++) {
				this.listeners[events[i]] = [];
			}
		}

		this.alias();
	};

	EventHandler.prototype.getEntity = function () {
		return this.entity;
	};

	/**
	 * Adds a listener to the entity for the specified event.
	 * @param {!string} event - Name of event to attach listener to.
	 * @param {!Function} action - The listener function to be trigger on event.
	 * @param {Object} context - The scope that will be applied to the action.
	 * @return {Object} The entity the handler is attached to.
	 */
	EventHandler.prototype.on = function (events, action, context) {
		if (typeof events === 'string') {
			events = [events];
		}

		for (var i = 0, length = events.length; i < length; i++) {
			if (!this.listeners.hasOwnProperty(events[i])) {
				this.listeners[events[i]] = [];
			}

			var listener = new modules.EventListener(events[i], this, action, context);
			this.listeners[events[i]].push(listener);
		}

		return this.entity;
	};

	/**
	 * Adds a listener to the entity for the specified event that will only fire once.
	 * @param {!string} event - Name of event to attach listener to.
	 * @param {!Function} action - The listener function to be trigger on event.
	 * @param {Object} context - The scope that will be applied to the action.
	 * @return {Object} The entity the handler is attached to.
	 */
	EventHandler.prototype.once = function (events, action, context) {
		var self = this,
		once = function () {
			self.off(events, once, context);
			action.apply(this, arguments);
		};
		once._action = action;
		return this.on(events, once, context);
	};

	/**
	 * Removes alls listener from the entity. Removes all listeners on the enitity matching provided criteria.
	 * @param {string} eventName - Name of event to remove listener from.
	 * @param {Function} action - The listener function for the event.
	 * @param {Object} context - The scope for the action.
	 * @return {Object} The entity the handler is attached to.
	 */
	EventHandler.prototype.off = function (events, action, context) {
		if (typeof events === 'string') {
			events = [events];
		}

		var eventsProvided = events && events.length,
		detailsProvided = action || context;

		// Nothing Specified So Clear All Listeners
		if (!eventsProvided && !detailsProvided) {
			return this.clear();
		}

		// No Events Specified So Check All Listeners
		if (!eventsProvided && detailsProvided) {
			return this.removeListeners(action, context);
		}

		// Only Events Specified So Clear All Listeners for the Specified Events
		if (eventsProvided && !detailsProvided) {
			return this.clearEventListeners(events);
		}

		var i, numEvents = events.length, j, numListeners, listeners, listener;
		for (i = 0; i < numEvents; i++) {
			numListeners = this.listeners[events[i]].length;
			listeners = [];

			for (j = 0; j < numListeners; j++) {
				listener = this.listeners[events[i]][j];

				if (!listener.matches(action, context)) {
					listeners.push(listener);
				}
			}

			this.listeners[events[i]] = listeners;
		}

		return this.entity;
	};


	/**
	 * Trigger all listeners for the provided eventName.
	 * @param {string} eventName - Name of event to trigger listeners for.
	 * @param {Object} data - The data to be passed to the trigger listeners.
	 * @return {Object} The entity the handler is attached to.
	 */
	EventHandler.prototype.trigger = function (events, data) {
		if (typeof events === 'string') {
			events = [events];
		}

		var i, length, entityEvent;

		for (i = 0, length = events.length; i < length; i++) {
			entityEvent = new modules.EntityEvent(events[i], this, data);

			this.triggerListeners(this.listeners[events[i]], entityEvent);
			this.triggerListeners(this.listeners.all, entityEvent);
		}

		return this.entity;
	};

	/**
	 * Helper method for triggering events. Handles calling a list of listeners.
	 * @param {Array.<Function>} events - The list of listeners to be called.
	 * @param {EntityEvent} event - The event object to be passed to each listener.
	 * @private
	 */
	EventHandler.prototype.triggerListeners = function (listeners, entityEvent) {
		for (var i = 0, length = listeners.length; i < length; i++) {
			listeners[i].trigger(entityEvent);
		}
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
	 * Helper method for clearing all events.
	 * @private
	 */
	EventHandler.prototype.clearListeners = function () {
		var event;

		for (event in this.listeners) {
			if (this.listeners.hasOwnProperty(event)) {
				this.listeners[event] = [];
			}
		}

		return this.entity;
	};

	EventHandler.prototype.clearEventListeners = function (events) {
		for (var i = 0, length = events.length; i < length; i++) {
			if (this.listeners.hasOwnProperty(events[i])) {
				this.listeners[events[i]] = [];
			}
		}

		return this.entity;
	};

	EventHandler.prototype.removeListeners = function (action, context) {
		var event, i, length, listeners, listener;

		for (event in this.listeners) {
			if (this.listeners.hasOwnProperty(event)) {
				listeners = [];

				for (i = 0, length = this.listeners[event].length; i < length; i++) {
					listener = this.listeners[event][i];

					if (!listener.matches(action, context)) {
						listeners.push(listener);
					}
				}

				this.listeners[event] = listeners;
			}
		}

		return this.entity;
	};

	return EventHandler;

})(exports);
