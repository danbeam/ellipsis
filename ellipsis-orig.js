YUI().use('node', function (Y) {

        // the element we're trying to truncate
    var yEl           = Y.one('.vglry_meta .yui-carousel-item-selected .description'),
        
        // copy the element so we can string length invisibly
        clone         = Y.one(document.createElement(yEl.get('nodeName'))),

        // end marker
        ellipsis      = ' ...',
        
        // for stuff we *really* don't want to wrap, increase this number just in case
        fudgeFactor   = 0,

        // target number of lines to wrap
        targetLines   = 3,

        // compute how high the node should be if it's the right number of lines
        targetHeight  = targetLines * parseInt(yEl.getComputedStyle('lineHeight')),

        // original text
        originalText  = yEl.get('text'),
        
        // keep the current length of the text so far
        currentLength = originalText.length,
        
        // the number of characters to increment or decrement the text by
        charIncrement = Math.floor(originalText.length / 2),
  
        // some current values used to cache .getComputedStyle() accesses and compare to our goals
        currentHeight = parseInt(yEl.getComputedStyle('height'));

    // console.log('currentHeight', currentHeight);
    // console.log('targetHeight', targetHeight);

    // quick sanity check
    if (currentHeight <= targetHeight) {
        console.log('silly you!');
        return;
    }
    
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
    
    // unfortunately, we must insert into the DOM, :(
    Y.one('body').append(clone);

    // now, let's start looping through and slicing the text as necessary
    for (var lastKnownGood; charIncrement >= 1;) {

        // increment decays by half every time 
        charIncrement = Math.floor(charIncrement / 2);
        
        // if the height is too big, remove some chars, else add some
        currentLength += currentHeight > targetHeight ? -charIncrement : +charIncrement;
        
        // try text at current length
        clone.set('text', originalText.slice(0, currentLength - ellipsis.length) + ellipsis);
        
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
    
    // do this thing, already!
    yEl.set('text', originalText.slice(0, lastKnownGood - ellipsis.length - fudgeFactor) + ellipsis);

}); undefined
