(function($) {

  $.fn.extend({
    keybind: function(seq, handler) {
      var data = this.data('keybind'),
          handlers;

      if (!data) {
        data = { bindings: {} };
        this.data('keybind', data)
            .bind({ keypress: keypressHandler,
                    keydown:  keydownHandler,
                    keyup:    keyupHandler });
      }

      handlers = data.bindings[seq];
      if (handlers)
        handlers.push(handler);
      else
        data.bindings[seq] = [handler];

      return this;
    },

    keyunbind: function(seq, handler) {
      var data = this.data('keybind'),
          handlers = data.bindings[seq];

      if (handler !== undefined) {
        data.bindings[seq] = $.grep(data.bindings[seq], function(h) {
          return h !== handler;
        });
      } else
        delete data.bindings[seq];

      return this;
    },

    keyunbindAll: function() {
      $(this).removeData('keybind')
             .unbind({ keypress: keypressHandler,
                       keydown:  keydownHandler,
                       keyup:    keyupHandler });
      return this;
    }
  });

  function keypressHandler(event) {
    var data = $(this).data('keybind'),
        key  = { chord: eventChord(event) };

    if ((event.charCode && event.charCode >= 37 && event.charCode <= 40) ||
        !shouldTriggerOnKeydown(event))
      triggerHandlers(data.bindings, key, event);

    return false;
  }

  function keydownHandler(event) {
    if (!shouldTriggerOnKeydown(event))
      return;

    var data = $(this).data('keybind'),
        key  = { chord: eventChord(event) };

    triggerHandlers(data.bindings, key, event);
    return false;
  }

  function keyupHandler(event) {
  }

  function eventChord(event) {
    if (event.type === 'keypress')
      return String.fromCharCode(event.charCode || event.keyCode);
    else
      return _specialKeys[event.keyCode];
  }

  function triggerHandlers(bindings, key, event) {
    var handlers = bindings[key.chord];
    if (handlers !== undefined)
      $.each(handlers, function(i, fn) { fn(key, event); });
  }

  function shouldTriggerOnKeydown(event) {
    return event.keyCode in _specialKeys;
  }

  var _specialKeys = {
    13: 'Enter', 27: 'Esc', 37: 'Left', 38: 'Up', 39: 'Right', 40: 'Down'
  };

}(jQuery));
