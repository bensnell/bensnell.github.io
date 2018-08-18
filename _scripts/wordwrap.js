/**
 * Plugin for text metrics and wordwrap.
 *
 * @author Vojtech Kusy <vojta-at-atomicant.co.uk>
 * @version 1.0
 */
(function($) {
    /**
     * @class Singleton Class for measuring the text
     * @see http://kaijaeger.com/articles/the-singleton-design-pattern-in-javascript.html
     */
    var TextMetrics = (function() {
        var instance = null;

        function PrivateConstructor() {
            var $_sensor = $('<div/>').css({
                display: 'none',
                margin: 0,
                padding: 0,
                border: 0,
                position: 'absolute',
                top: -9999,
                left: -9999
            });
            $_sensor.appendTo('body');

            this.setCss = function(property, value) {
                $_sensor.css(property, value);
            };

            this.adopt = function(el) {
                var styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (var i = 0, len = styles.length; i < len; i++) {
                    this.setCss(styles[i], $(el).css(styles[i]));
                }
            };

            this.width = function(text) {
                $_sensor.html(text);
                return $_sensor.width();
            };

            this.height = function(text) {
                $_sensor.html(text);
                return $_sensor.height();
            };

            this.size = function(text) {
                $_sensor.html(text);
                return {
                    'height': $_sensor.height(),
                    'width': $_sensor.width()
                };
            };
        }

        // Public interface
        return new (function() {
            this.getInstance = function() {
                if (instance === null) {
                    instance = new PrivateConstructor();
                    instance.constructor = null;
                }
                return instance;
            };
        })();

    })(); // end of TextMetrics singleton
    
    
    /**
     * @class Class for wrapping the text
     */
    $.WordWrap = function(width, options, text_metrics) {
        var defaults = {
            splitDelimiter: /\s+/,
            joinDelimiter: "&nbsp;",
            lineStart: '',
            lineEnd: '',
            orphanLength: 0,
            orphanWidth: 0
        };
        this.options = $.extend(defaults, options || {});
        this.width = width || 0;
        this.wordMetrics = text_metrics || TextMetrics.getInstance();
    };

    // Public interface
    $.extend($.WordWrap.prototype, {

        setCss: function(property, value) {
            this.wordMetrics.setCss(property, value);
        },

        adopt: function(el) {
            this.wordMetrics.adopt(el);
        },

        wrap: function(text) {
            var word = '',
                lines = [],
                new_line = '',
                line = '',
                line_width = 0,
                new_line_width = 0,
                words = text.split(this.options.splitDelimiter),
                line_widths = [];
            while (words.length) {
                word = words.shift();
                new_line = (line === '') ? word : line + this.options.joinDelimiter + word;
                new_line_width = this.wordMetrics.width(new_line);

                if (new_line_width <= this.width) {
                    line = new_line;
                    line_width = new_line_width;
                }
                else if (new_line_width > this.width && line === '') {
                    lines.push(new_line);
                    line_widths.push(new_line_width);
                    new_line = line = '';
                }
                else {
                    lines.push(line);
                    line_widths.push(line_width);
                    new_line = line = word;
                }
            }

            // If the loop finished and something lefts in the new_line add it as a last line.
            if (new_line) {
                lines.push(new_line);
                line_widths.push(line_width);
            }

            lines = this._processOrphans(lines, line_widths);

            return lines;
        },

        join: function(text, line_start, line_end) {
            var start = line_start || this.options.lineStart;
            var end = line_end || this.options.lineEnd;
            var lines = this.wrap(text);
            return start + lines.join(end + start) + end;
        },

        _processOrphans: function(lines, widths) {
            if (this.options.orphanLength || this.options.orphanWidth) {
                for (var i = 0, n = i + 1; i < lines.length; i++) {
                    var line = lines[i];
                    var next = (n < lines.length) ? lines[n] : '';
                    if (next.length > 0 && (next.length <= this.options.orphanLength || widths[n] <= this.options.orphanWidth)) {
                        lines[i] = line + this.options.joinDelimiter + next;
                        lines[n] = '';
                    }
                }

                // Clean empty lines
                lines = $.grep(lines, function(n) {
                    return (n);
                });
            }

            return lines;
        }
    });

    // Extend jQuery
    $.fn.wordWrap = function(width, options) {
        //Iterate over the current set of matched elements
        return this.each(function() {
            var $this = $(this);
            var text = $this.html();
            if (text.length) {
                width = width ? width : $this.width();
                var word_wrap = new $.WordWrap(width, options);
                word_wrap.adopt(this);
                $this.html(word_wrap.join(text));
            }
        });
    };


})(jQuery);

/* Example Use: */

(function($) {
  
  var options = {
    lineStart: '<span>',
    lineEnd: '</span>',
    orphanLength: 2
  };
  
  $("#slideshow h3 a").wordWrap(300, options);
  
})(jQuery);