jquery.keybind
==============

This library attempts to provide a reasonable, portable implementation
of keybinding support for jQuery. Browser keyboard events are a
notoriously hairy collection of cross-browser incompatibilities.

The goal is essentially to allow listening for key presses without the
need to concern oneself with the differences between
keydown/keyup/keypress.  This library hopes to make it possible to
write code as if keypress were the only event, and the event always
accurately described the keys pressed.


Examples
--------

    $(document).keybind('a', function(key, event) {
      // key is an object describing the keychord that triggered this event:
      //   { name: 'a',    modified: false, shift: false, ctrl: false, ... }
      //   { name: 'C-F1', modified: true,  shift: false, ctrl: true, ... }
      // event is the jQuery event object
      // event.originalEvent is the browser's event object, stored by jQuery
    });

    // Binding multiple keys at once:
    $(document).keybind({ 'C-s': save,
                          'C-z': undo,
                          'C-Backspace': deleteWord });

    // Removing bindings:
    $(document).keybind('C-s', save);
    $(document).keyunbind('C-s');

    // Multiple callbacks for a single keybinding:
    $(document).keybind('C-s', backup)
               .keybind('C-s', save);
    $(document).keyunbind('C-s', backup); // C-s still bound to save
    $(document).keyunbind('C-s');         // clears all handlers bound to the key

    // Emacs-esque key sequences:
    $(document).keybind('C-x C-f', open);
    $(document).keybind('Up Up Down Down Left Right Left Right b a',
                        konami);

    // Indiscriminate binding:
    //   -- I don't really know how this would work. I may skip it.
    //      Does it report a "just modifier" keypress?
    $(document).keybind(function(key, event) {
      // ...
    });


Caveats
-------

IE seems to have no concept of the meta key. You should not use any
'M-...' keybindings if you expect them to work for IE users. Even if
you don't care about IE users, you probably shouldn't rely on the meta
key, as few people know what the hell a meta key is. It may, however,
be reasonable to provide M- bindings which are also available via other
bindings, so that Mac users can use their Cmd key (which is meta).

Many conceivable bindings (eg, C-a, C-t, F1, and many more) run the
risk of shadowing native browser keyboard shortcuts. Some browsers
never trigger events for such keybindings; some browsers trigger the
event, but do not allow you to prevent the browser's native handling
from running; and some browsers let you fully prevent the native
functionality. The details of the above are available from the
references below; I won't attempt to reproduce it here and run the
risk of transcription errors.

There are likely serious internationalization / keyboard layout issues
that I simply do not know how to address. I have only a vague notion
of what the specific problems would be.

tl;dr:

1. Make sure M- bindings are available on other keys.
2. Don't bind to C-a, C-s, F1, &c.
3. Use punctuation and non-ASCII characters at your own risk.
   Then help me fix any issues you run into.


Tested On
---------

I wrote this using the following browsers:

* Chromium 5.0.342.9 (43360) (WebKit 533.2) on Linux
* Namoroka 3.6.3 (Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.3) Gecko/20100402 Namoroka/3.6.3) on Linux
* Google Chrome 5.0.375.55 beta (WebKit 533.4) on OS X 10.5
* Firefox 3.6.3 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3) on OS X 10.5
* Safari 4.0 (5530.17) (WebKit 530.17) on OS X 10.5
* Firefox 3.6.3 (Mozilla/5.0; (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3) on Windows 7
* Google Chrome 4.1.249.1064 (45376) (WebKit 532.5) on Windows 7
* Internet Explorer 8.0.7600.16385 on Windows 7 (also in IE7 compatibility mode)

The lack of Opera testing is solely because I have been too lazy to do so. Soon.

The lack of Konqueror testing is solely because, well, ...


References
----------

There are a number of articles detailing the differences in keyboard
event handling across browsers. I have relied primarily upon:

* [DOM Level 3 Events Specification](http://www.w3.org/TR/DOM-Level-3-Events/)
* [JavaScript Madness: Keyboard Events](http://unixpapa.com/js/key.html)
* [Quirksmode on Detecting Keystrokes](http://www.quirksmode.org/js/keys.html)
* [Keyboard accessibility in web applications](http://dev.opera.com/articles/view/keyboard-accessible-web-applications-3/)

I have also referenced two libraries which make efforts to hide much
of the insanity of the raw browser keyboard events:

* [Google's Closure](http://code.google.com/closure/library/); specifically, see
  [keyhandler.js](http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/events/keyhandler.js),
  [keycodes.js](http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/events/keycodes.js),
  and most helpfully,
  [keyhandler_test.html](http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/events/keyhandler_test.html).
* The example code from the dev.opera.com article linked above, available for download
  [here](http://dev.opera.com/articles/view/keyboard-accessible-web-applications-1/);
  specifically, see app4/lib.js.

Both of the above libraries have detailed comments explaining what
they do, and have been an enormous help. I would have rm -rf'd this
project had I not had them available for reference.
