/**
* Ellipsis plugin (YUI) - For when text is too l ...
*
* @fileOverview  A slightly smarter way of truncating text
* @author        Dan Beam <dan@danbeam.org>
* @param         {object} conf - configuration objects to override the defaults
* @return        {Node} the Node passed to the method
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

YUI().add('ellipsis', function (Y) {

    // add this on all Y.Node instances (but only if imported
    Y.DOM.ellipsis = function (node, conf) {

        // augment our conf object with some default settings
        conf = Y.mix(conf || {}, {
            // end marker
            'ellipsis' : ' ...',
            
            // for stuff we *really* don't want to wrap, increase this number just in case
            'fudge'    : 0,

            // target number of lines to wrap
            'lines'    : 1
        });

            // the element we're trying to truncate
        var yEl           = Y.one(node),

            // compute how high the node should be if it's the right number of lines
            targetHeight  = conf.lines * parseInt(yEl.getComputedStyle('lineHeight')),

            // original text
            originalText  = yEl.getAttribute('originalText') || yEl.get('text'),
            
            // keep the current length of the text so far
            currentLength = originalText.length,
            
            // the number of characters to increment or decrement the text by
            charIncrement = currentLength,
      
            // copy the element so we can string length invisibly
            clone = Y.one(document.createElement(yEl.get('nodeName'))),

            // some current values used to cache .getComputedStyle() accesses and compare to our goals
            currentHeight;

        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // @ NOTE: I'm intentionally ignoring padding as .getComputedStyle('height') @
        // @ NOTE: and .getComputedStyle('width') both ignore this as well.          @
        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        // copy styles to clone object
        clone.setStyles({
            'position'      : 'absolute',
            'visibility'    : 'hidden',
            'bottom'        : '-10px',
            'right'         : '-10px',
            'width'         : yEl.getComputedStyle('width'),
            'fontSize'      : yEl.getComputedStyle('fontSize'),
            'fontFamily'    : yEl.getComputedStyle('fontFamily'),
            'fontWeight'    : yEl.getComputedStyle('fontWeight'),
            'letterSpacing' : yEl.getComputedStyle('letterSpacing'),
            'lineHeight'    : yEl.getComputedStyle('lineHeight')
        });

        // insert the original text, in case we've already truncated
        clone.set('text', originalText);

        // unfortunately, we must insert into the DOM, :(
        Y.one('body').append(clone);

        // ok, now that we have a node in the DOM with the right text, measure it's height
        currentHeight = parseInt(clone.getComputedStyle('height'));

        // console.log('currentHeight', currentHeight);
        // console.log('targetHeight', targetHeight);

        // quick sanity check
        if (currentHeight <= targetHeight) {
            // console.log('truncation not necessary!');
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
            clone.set('text', originalText.slice(0, currentLength - conf.ellipsis.length) + conf.ellipsis);
            
            // compute the current height
            currentHeight = parseInt(clone.getComputedStyle('height'));

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
        
        // set the original text if we want to ever want to expand past the current truncation
        if (!yEl.getAttribute('originalText')) {
            yEl.setAttribute('originalText', originalText);
        }

        // do this thing, already!
        yEl.set('text', originalText.slice(0, lastKnownGood - conf.ellipsis.length - conf.fudge) + conf.ellipsis);

        // return myself for chainability
        return yEl;

    };

    Y.Node.importMethod(Y.DOM, 'ellipsis');
    Y.NodeList.importMethod(Y.Node.prototype, 'ellipsis');

},

'0.0.1',

{'requires' : ['base', 'node']});
