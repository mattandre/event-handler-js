/**
 * EventHandler - Handles triggering and listening to the events of an entity.
 * @param {Object} entity - The entity to which the handler is attaching to.
 * @param {Array.<string>} events - An array of event names that this handler will use.
 * @constructor
 */
var EventHandler = function(entity, events) {
	this.entity = entity;
	this.events = { 'all': [] };
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
EventHandler.prototype.alias = function() {
	this.entity.on      = $.proxy(this.on, this);
	this.entity.once    = $.proxy(this.once, this);
	this.entity.off     = $.proxy(this.off, this);
	this.entity.trigger = $.proxy(this.trigger, this);
};

/**
 * Adds a listener to the entity for the specified event.
 * @param {!string} eventName - Name of event to attach listener to.
 * @param {!Function} action - The listener function to be trigger on event.
 * @param {Object} context - The scope that will be applied to the action.
 * @return {Object} The entity the handler is attached to.
 */
EventHandler.prototype.on = function(eventName, action, context) {
	if (!(eventName in this.events)) {
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
EventHandler.prototype.once = function(eventName, action, context) {
	var self = this,
			once = function() {
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
EventHandler.prototype.off = function(eventName, action, context) {
	if (!action && !context) {
		if (!eventName) {
			this.clear();
		} else {
			this.events[eventName] = [];
		}
		return this.entity;
	}
	var events = this.events[eventName],
			retain = [], ev;
	for (var i = 0, l = events.length; i < l; i++) {
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
 * @param {Array} args - A list to be passed to the trigger listeners.
 * @return {Object} The entity the handler is attached to.
 */
EventHandler.prototype.trigger = function(eventName, args) {
	if (eventName in this.events) {
		this.triggerEvents(this.events[eventName], args || []);
	}

	if ('all' in this.events) {
		this.triggerEvents(this.events.all, args || []);
	}

	return this.entity;
};

/**
 * Helper method for triggering events. Handles calling a list of listeners.
 * @param {Array.<Function>} events - The list of listeners to be called.
 * @param {Array} args - The list of arguments to be passed to each listener.
 * @private
 */
EventHandler.prototype.triggerEvents = function(events, args) {
	var ev,
	i = -1, 
	l = events.length, 
	a1 = args[0], 
	a2 = args[1], 
	a3 = args[2];

	switch (args.length) {
		case 0: 
			while (++i < l) {
				ev = events[i];
				ev.action.call(ev.context);
			}
			break;
		case 1: 
			while (++i < l) {
				ev = events[i];
				ev.action.call(ev.context, a1);
			}
			break;
		case 2: 
			while (++i < l) {
				ev = events[i];
				ev.action.call(ev.context, a1, a2);
			}
			break;
		case 3: 
			while (++i < l) {
				ev = events[i];
				ev.action.call(ev.context, a1, a2, a3);
			}
			break;
		default: 
			while (++i < l) {
				ev = events[i];
				ev.action.apply(ev.context, args);
			}
			break;
	}
};

/**
 * Helper method for clearing all events.
 * @private
 */
EventHandler.prototype.clear = function() {
	for (var key in this.events) {
		if (this.events.hasOwnProperty(key)) {
			this.events[key] = [];
	   	}		
	}
};
