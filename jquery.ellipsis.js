(function ($) {

    // add this on all Y.Node instances (but only if imported
    $.fn.ellipsis = function (conf) {

        // augment our conf object with some default settings
        conf = $.extend({
            // end marker
            'ellipsis' : ' ...',
                
            // for stuff we *really* don't want to wrap, increase this number just in case
            'fudge'    : 0,

            // target number of lines to wrap
            'lines'    : 1
        
        }, conf || {});

        // iterate over all things in the prototype
        return this.each(function () {

                // the element we're trying to truncate
            var $el = $(this);

                // compute how high the node should be if it's the right number of lines
                targetHeight  = conf.lines * parseInt($el.css('line-height')),

                // original text
                originalText  = $el.text(),
                
                // keep the current length of the text so far
                currentLength = originalText.length,
                
                // the number of characters to increment or decrement the text by
                charIncrement = currentLength,
          
                // some current values used to cache .getComputedStyle() accesses and compare to our goals
                currentHeight = $el.height();

            // console.log('currentLength', currentLength);
            // console.log('currentHeight', currentHeight);
            // console.log('targetHeight', targetHeight);

            // quick sanity check
            if (currentHeight <= targetHeight) {
                // console.log('silly you!');
                return;
            }
            
                // copy the element so we can string length invisibly
            var clone = $(document.createElement($el[0].nodeName));
            
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            // @ NOTE: I'm intentionally ignoring padding as .getComputedStyle('height') @
            // @ NOTE: and .getComputedStyle('width') both ignore this as well.          @
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

            // copy styles to clone object
            clone.css({
                'position'      : 'absolute',
                'visibility'    : 'hidden',
                'bottom'        : '-10px',
                'right'         : '-10px',
                'width'         : $el.css('width'),
                'fontSize'      : $el.css('font-size'),
                'fontFamily'    : $el.css('font-family'),
                'fontWeight'    : $el.css('font-weight'),
                'letterSpacing' : $el.css('letter-spacing'),
                'lineHeight'    : $el.css('line-height')
            });

            // unfortunately, we must insert into the DOM, :(
            $('body').append(clone);

            // now, let's start looping through and slicing the text as necessary
            for (var lastKnownGood; charIncrement >= 1;) {

                // increment decays by half every time 
                charIncrement = Math.floor(charIncrement / 2);

                // if the height is too big, remove some chars, else add some
                currentLength += currentHeight > targetHeight ? -charIncrement : +charIncrement;
                
                // try text at current length
                clone.text(originalText.slice(0, currentLength - conf.ellipsis.length) + conf.ellipsis);
                
                // compute the current height
                currentHeight = clone.height();

                // we only want to store values that aren't too big
                if (currentHeight <= targetHeight) {
                    lastKnownGood = currentLength;
                }

                // console.log('currentLength', currentLength);
                // console.log('currentHeight', currentHeight);
                // console.log('targetHeight' , targetHeight );
                // console.log('charIncrement', charIncrement);
                // console.log('lastKnownGood', lastKnownGood);

            }

            // remove from DOM
            clone.remove();
            
            // do this thing, already!
            $el.text(originalText.slice(0, lastKnownGood - conf.ellipsis.length - conf.fudge) + conf.ellipsis);

        });

    };

})(jQuery)
