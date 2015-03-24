(function(){

    var popoverFns = {
        tags : popTags,
        brackets : popBrackets,
        attributes : popAttrs,
        css : popCSS,
        'css-multi' : popCSSMulti
    },
    liveUpdates = {
        updateSlideColor : updateSlideColor,
        updateElement : updateElement
    };

    _.mixin(s.exports());

    // Full list of configuration options available at:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        width: '100%',
        margin: 0.05,
        controls: true,
        progress: true,
        history: true,
        center: true,
        transition: 'slide', // none/fade/slide/convex/concave/zoom
        // Optional reveal.js plugins
        dependencies: [
            // { src: '../../slides/lib/revealjs/lib/js/classList.js', condition: function() { return !document.body.classList; } },
            { src: '../../slides/lib/revealjs/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            // { src: '../../slides/lib/revealjs/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            { src: '../../slides/lib/revealjs/plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
            // { src: '../../slides/lib/revealjs/plugin/zoom-js/zoom.js', async: true },
            { src: '../../slides/lib/revealjs/plugin/notes/notes.js', async: true },
            { src: '../../slides/lib/revealjs/plugin/reveal-code-focus/code-focus.js', async: true, callback: function(){ RevealCodeFocus(); } }
        ]
    });

    setupTimer();




    Reveal.addEventListener( 'slidechanged', function( slideChangeEvent ) {

        // Some sneaky stuffs because highlight js be parsing out some tags we need to show in the code
        checkAndShowSneakyTags( slideChangeEvent );

        funkyToolTipBusiness( slideChangeEvent );

        $(slideChangeEvent.currentSlide).find('[data-cut]').each(function(iter, element){
            $(element).find($(element).data('cut')).remove();
            $(element).data('cut', false);
        });

        bindCodeUpdates( slideChangeEvent );
    });


    Reveal.addEventListener( 'fragmentshown', function( fragmentShownEvent ) {

        // Allows us to simultaneously highlight code with normal fragments
        highlightSimultaneous( fragmentShownEvent );
    } );





    function checkAndShowSneakyTags(slideChangeEvent){
        var highlightTitles = slideChangeEvent.currentSlide.querySelectorAll('.hljs-title, .hljs-attribute');
        var highlightTags = slideChangeEvent.currentSlide.querySelectorAll('.html.hljs > .hljs-tag');
        var docTextNode = document.createTextNode('< !');

        highlightTitles = Array.prototype.slice.call(highlightTitles, 0);
        highlightTags = Array.prototype.slice.call(highlightTags, 0);

        highlightTitles.forEach(function(element){
            if(element.textContent.indexOf('.') == (element.textContent.length - 1)){

                element.textContent = element.textContent.slice(0, -1);
            }
        });

        highlightTags.forEach(function(element){
            if(element.childNodes[0].data == '< !'){
                element.childNodes[0].data = '<!';
            }
        });
    }



    function highlightSimultaneous(fragmentShownEvent){
        var elements;

        if(event.fragment.dataset.highlight){

            elements = document.querySelectorAll('.present ' + event.fragment.dataset.highlight);

            elements = Array.prototype.slice.call(elements, 0);

            elements.forEach(function(element){
                if(element.dataset.fragmentIndex){
                    return;
                }
                element.className += ' ' + event.fragment.className;
                element.dataset.fragmentIndex = event.fragment.dataset.fragmentIndex;
            });
        }
    }


    function funkyToolTipBusiness(slideChangeEvent){

        if(slideChangeEvent.currentSlide.dataset.assignPopovers){

            if(slideChangeEvent.currentSlide.querySelectorAll('.tipped').length){
                showToolTips();
                return;
            }

            popoverFns[slideChangeEvent.currentSlide.dataset.assignPopovers](slideChangeEvent.currentSlide);

            $('[data-toggle="tooltip"]').tooltip();
            // showToolTips();
        }else{
            $('[data-toggle="tooltip"]').tooltip('hide');
        }
    }


    function bindCodeUpdates(slideChangeEvent){

        var editors = slideChangeEvent.currentSlide.querySelectorAll('code[contenteditable]'),
            events;

        editors = Array.prototype.slice.call(editors);

        editors.forEach(function(editor){
            if(editor.dataset.changeFn){
                editor.parentSlide = slideChangeEvent.currentSlide;
                editor.slideIndex = Array.prototype.indexOf.call(slideChangeEvent.currentSlide.parentElement.children, editor.parentSlide);
                events = JSON.parse(editor.dataset.changeTrigger);

                events.forEach(function(trigger){
                    editor.addEventListener(trigger, liveUpdates[editor.dataset.changeFn]);
                });

                liveUpdates[editor.dataset.changeFn].call(editor);
            }
        });
    }


    function updateSlideColor(){
        document.querySelector('.backgrounds').children[this.slideIndex].style.background = this.querySelector('.hljs-rule > .hljs-value').innerText.trim();
        this.parentSlide.querySelector('.slide-color').innerText = this.querySelector('.hljs-rule > .hljs-value').innerText.trim();
    }

    function updateElement(triggerEvent){
        var elementStyle = {};

        if(typeof triggerEvent === 'undefined' || triggerEvent.type === 'focusout' || triggerEvent.keyCode === 13){
            this.parentSlide.querySelector('.style-sentence').innerHTML = buildCSSSentence(this, elementStyle);
            _.assign(this.parentSlide.querySelector('p').style, elementStyle);
        }
    }

    function buildCSSSentence(editor, elementStyle){
        var lines = editor.querySelectorAll('.line > .line'),
            propValPairs = [], propertyIndexes = {};

        lines = Array.prototype.slice.call(lines);

        lines.forEach(function(line, iter){
            var lineRule = line.innerText.replace(';','').trim(),
                propValString, rules, property, value;

            if(lineRule.length === 0 || lineRule === '}'){
                return;
            }

            propValString = lineRule.replace(': ', ' is ');
            rules = lineRule.split(': ');
            property = rules[0];
            value = rules[1];

            elementStyle[_.camelize(property)] = value;

            if(typeof propertyIndexes[property] === 'number'){
                propValPairs[propertyIndexes[property]] = propValString;
                return;
            }

            propertyIndexes[property] = propValPairs.length;
            propValPairs.push(propValString);
        });

        if(propValPairs.length > 1){
            propValPairs[propValPairs.length - 1] = 'and ' + propValPairs[propValPairs.length - 1];
        }

        return propValPairs.join(', <br>');
    }



    function popCSSMulti(parent){
        var propertyName = parent.querySelector('pre > code.css > .line .hljs-attribute'),
            propertyValue =  parent.querySelector('pre > code.css > .line .hljs-value');

        addToolTip(propertyName, 'Property', parent.dataset.assignPopovers);
        addToolTip(propertyValue, 'Value', parent.dataset.assignPopovers);
        propertyValue.dataset.placement = 'right';

    }


    function popCSS(parent){
        var selector = parent.querySelector('pre > code.css > .line > .hljs-tag'),
            openingBracket =  parent.querySelector('pre > code.css > .line > .hljs-rules'),
            closingBracket =  parent.querySelector('pre > code.css > .line > .line:last-child'),
            rule =  parent.querySelector('pre > code.css > .line > .line:nth-child(3)');

        addToolTip(selector, 'Selector', parent.dataset.assignPopovers);
        selector.dataset.placement = 'top';

        addToolTip(openingBracket, 'Opening Curly Bracket', parent.dataset.assignPopovers);

        addToolTip(closingBracket, 'Closing Curly Bracket', parent.dataset.assignPopovers);
        closingBracket.dataset.placement = 'bottom';

        addToolTip(rule, 'Declaration', parent.dataset.assignPopovers);
    }


    function popAttrs(parent){
        var attr = parent.querySelector('pre > code.html .hljs-attribute'),
            attrValue = parent.querySelector('pre > code.html .hljs-value');

        addToolTip(attr, 'Attribute', parent.dataset.assignPopovers);
        addToolTip(attrValue, 'Attribute\'s Value', parent.dataset.assignPopovers);
    }


    function popTags(parent){

        var openingTag = parent.querySelector('pre > code.html .line > .hljs-tag:first-child'),
            closingTag = parent.querySelector('pre > code.html .line > .hljs-tag:last-child');

        addToolTip(openingTag, 'Opening Tag', parent.dataset.assignPopovers);
        addToolTip(closingTag, 'Closing Tag', parent.dataset.assignPopovers);
        closingTag.dataset.placement = 'bottom';
    }


    function popBrackets(parent){

        var openingTag, closingTag;

        openingTag = parent.querySelectorAll('pre > code.html .line > .hljs-tag:first-child');
        closingTag = parent.querySelectorAll('pre > code.html .line > .hljs-tag:last-child');
        closingTagTitleNode = closingTag[0].childNodes[1];

        var lBracket = document.createElement('span');
        lBracket.textContent = "<";

        addToolTip(lBracket, 'Left-angle bracket (Less-than sign)', parent.dataset.assignPopovers);
        lBracket.dataset.placement = 'left';

        var lastLBracket = lBracket.cloneNode(true);
        lastLBracket.dataset.placement = 'bottom';

        var rBracket = document.createElement('span');
        rBracket.textContent = ">";

        addToolTip(rBracket, 'Right-angle bracket (Greater-than sign)', parent.dataset.assignPopovers);

        var lastBracket = rBracket.cloneNode(true);
        lastBracket.dataset.placement = 'right';

        var fSlash = document.createElement('span');
        fSlash.textContent = "/";

        addToolTip(fSlash, 'Forward Slash', parent.dataset.assignPopovers);


        openingTag[0].replaceChild(lBracket, openingTag[0].childNodes[0]);
        openingTag[0].replaceChild(rBracket, openingTag[0].childNodes[2]);

        closingTag[0].replaceChild(lastLBracket, closingTag[0].childNodes[0]);
        closingTag[0].replaceChild(fSlash, closingTag[0].childNodes[1]);
        closingTag[0].replaceChild(closingTagTitleNode, closingTag[0].childNodes[2]);
        closingTag[0].appendChild(lastBracket);
    }

    function addToolTip(element, label, popoverName){

        element.dataset.toggle = 'tooltip';
        element.title = label;
        element.dataset.container = '.present[data-assign-popovers='+popoverName+']';
        element.dataset.placement = 'top';
        element.dataset.trigger = 'click';
        element.className += ' tipped';
    }


    function showToolTips(){

        $('[data-toggle="tooltip"]').each(function(iter, element){
            setTimeout(function(){
                $(element).tooltip('show');
            }, 1000)
        });
    }




    /**
     * Some functions stolen from the notes html from reveal js lib for timers on a slide.
     *
     * Kinda jank for now, will need some work if we want different timers throughout doing different things.
     */
    /**
     * Create the timer and clock and start updating them
     * at an interval.
     */
    function setupTimer() {

        var start = new Date(),
            timeEl = document.querySelector( '.reveal-time' ),
            hoursEl, minutesEl, secondsEl, clickAction, actionIcon, actionText, resetEl, countdownFrom, counting, pausedTime, timerInterval;

        if(!timeEl){
            return;
        }

        hoursEl = timeEl.querySelector( '.hours-value' );
        minutesEl = timeEl.querySelector( '.minutes-value' );
        secondsEl = timeEl.querySelector( '.seconds-value' );
        clickAction = timeEl.querySelector( '.action' );
        actionIcon = clickAction.querySelector( 'i' );
        actionText = clickAction.querySelector( '.action-label' );
        resetEl = timeEl.querySelector( '.reset' );
        countdownFrom = timeEl.dataset.countdown;
        counting = false;
        pausedTime = 0;
        timerInterval;

        function _init(){

            if(counting){
                if(pausedTime){
                    start.setTime((new Date()).getTime() + parseFloat(pausedTime));
                }
                _updateTimer();
                // Then update every second
                timerInterval = setInterval( _updateTimer, 1000 );
                actionText.textContent = 'pause';
                actionIcon.className = 'fa fa-pause';

            } else {
                clearInterval(timerInterval);
                _updateTimer();
                actionText.textContent = 'start';
                actionIcon.className = 'fa fa-play';
                _pause();
            }

            counting = !counting;
        }

        function _reset() {
            start = new Date();
            pausedTime = 0;

            if(countdownFrom){
                start.setTime(start.getTime() + parseFloat(countdownFrom));
            }
        }

        function _pause() {

            pausedTime = start.getTime() - new Date().getTime();
        }

        function _updateTimer() {

            var diff, hours, minutes, seconds,
                now = new Date();

            diff = now.getTime() - start.getTime();

            diff = Math.abs(diff);


            hours = Math.floor( diff / ( 1000 * 60 * 60 ) );
            minutes = Math.floor( ( diff / ( 1000 * 60 ) ) % 60 );
            seconds = Math.floor( ( diff / 1000 ) % 60 );


            hoursEl.innerHTML = zeroPadInteger( hours );
            hoursEl.className = hours > 0 ? '' : 'mute';
            minutesEl.innerHTML = ':' + zeroPadInteger( minutes );
            minutesEl.className = minutes > 0 ? '' : 'mute';
            secondsEl.innerHTML = ':' + zeroPadInteger( seconds );

        }

        // Update once directly
        _reset();
        _init();

        timeEl.addEventListener( 'click', function() {
            _init();
            return false;
        } );

        resetEl.addEventListener( 'click', function() {
            _reset();
            _init();
            return false;
        } );

    }


    function zeroPadInteger( num ) {

        var str = '00' + parseInt( num );
        return str.substring( str.length - 2 );

    }
 
})();
