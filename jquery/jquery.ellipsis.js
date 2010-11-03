/**
* Ellipsis plugin (jQuery) - For when text is too l ...
*
* @fileOverview  A slightly smarter way of truncating text
* @author        Dan Beam <dan@danbeam.org>
* @param         {object} conf - configuration objects to override the defaults
* @return        {jQuery} an instance of jQuery with the original nodes
*
* Copyright (c) 2010 Dan Beam
* Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

; (function ($) {

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

        // console.log(conf);

        // iterate over all things in the prototype
        return this.each(function () {

                // the element we're trying to truncate
            var $el = $(this),

                // compute how high the node should be if it's the right number of lines
                targetHeight  = conf.lines * (parseInt($el.css('line-height')) || (parseInt($el.css('font-size')) + 3)),

                // original text
                originalText  = $el.attr('originalText') || $el.text(),
                
                // keep the current length of the text so far
                currentLength = originalText.length,
                
                // the number of characters to increment or decrement the text by
                charIncrement = currentLength,

                // copy the element so we can string length invisibly
                clone = $(document.createElement($el[0].nodeName)),
          
                // some current values used to cache .getComputedStyle() accesses and compare to our goals
                currentHeight;
            
            // console.log($el.css('line-height'));
            // console.log($el.css('font-size'));

            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            // @ NOTE: I'm intentionally ignoring padding as .css('height') @
            // @ NOTE: and .css('width') both ignore this as well (I think) @
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

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

            // insert original text so we can judge height
            clone.text(originalText);

            // unfortunately, we must insert into the DOM, :(
            $('body').append(clone);

            // get computed height of clone element
            currentHeight = clone.height();

            // console.log('currentLength', currentLength);
            // console.log('currentHeight', currentHeight);
            // console.log('targetHeight', targetHeight);

            // quick sanity check
            if (currentHeight <= targetHeight) {
                // console.log('no wrapping necessary!');
                clone.remove();
                return;
            }
            
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
            
            // remember the original text before it's munged
            if (!$el.attr('originalText')) {
                $el.attr('originalText', originalText);
            }

            // do this thing, already!
            $el.text(originalText.slice(0, lastKnownGood - conf.ellipsis.length - conf.fudge) + conf.ellipsis);

        });

    };

})(jQuery)
