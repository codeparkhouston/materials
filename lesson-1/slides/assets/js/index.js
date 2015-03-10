(function(){

    // Full list of configuration options available at:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,
        transition: 'slide', // none/fade/slide/convex/concave/zoom
        // Optional reveal.js plugins
        dependencies: [
            // { src: 'lib/revealjs/lib/js/classList.js', condition: function() { return !document.body.classList; } },
            { src: 'lib/revealjs/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            // { src: 'lib/revealjs/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
            { src: 'lib/revealjs/plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
            // { src: 'lib/revealjs/plugin/zoom-js/zoom.js', async: true },
            { src: 'lib/revealjs/plugin/notes/notes.js', async: true }
        ]
    });

    setupTimer();

    Reveal.addEventListener( 'slidechanged', function( slideChangeEvent ) {

        // Some sneaky stuffs because highlight js be parsing out some tags we need to show in the code
        checkAndShowSneakyTags( slideChangeEvent );

        funkyToolTipBusiness( slideChangeEvent );

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
        var openingTag, closingTag;
        if(slideChangeEvent.currentSlide.dataset.assignPopovers){

            if(slideChangeEvent.currentSlide.querySelectorAll('.tipped').length){
                showToolTips();
                return;
            }

            openingTag = slideChangeEvent.currentSlide.querySelectorAll('pre > code.html > .hljs-tag:first-child')
            closingTag = slideChangeEvent.currentSlide.querySelectorAll('pre > code.html > .hljs-tag:last-child')

            var lBracket = document.createElement('span');
            lBracket.textContent = "<";
            lBracket.dataset.toggle = 'tooltip';
            lBracket.title = 'Left-angle bracket (Less-than sign)';
            lBracket.dataset.content = 'Less-than sign';
            lBracket.dataset.container = '[data-assign-popovers]';
            lBracket.dataset.placement = 'left';
            lBracket.dataset.trigger = 'click';
            lBracket.className = 'tipped';

            var lastLBracket = lBracket.cloneNode(true);
            lastLBracket.dataset.placement = 'bottom';

            var rBracket = document.createElement('span');
            rBracket.textContent = ">";
            rBracket.dataset.toggle = 'tooltip';
            rBracket.title = 'Right-angle bracket (Greater-than sign)';
            rBracket.dataset.content = 'Greater-than sign';
            rBracket.dataset.container = '[data-assign-popovers]';
            rBracket.dataset.placement = 'top';
            rBracket.dataset.trigger = 'click';
            rBracket.className = 'tipped';

            var lastBracket = rBracket.cloneNode(true);
            lastBracket.dataset.placement = 'right';

            var fSlash = document.createElement('span');
            fSlash.textContent = "/";
            fSlash.dataset.toggle = 'tooltip';
            fSlash.title = 'Forward slash';
            fSlash.dataset.container = '[data-assign-popovers]';
            fSlash.dataset.placement = 'top';
            fSlash.dataset.trigger = 'click';
            fSlash.className = 'tipped';

            openingTag[0].replaceChild(lBracket, openingTag[0].childNodes[0]);
            openingTag[0].replaceChild(rBracket, openingTag[0].childNodes[2]);

            closingTag[0].replaceChild(lastLBracket, closingTag[0].childNodes[0]);
            closingTag[0].replaceChild(fSlash, closingTag[0].childNodes[2]);
            closingTag[0].appendChild(lastBracket);

            $('[data-toggle="tooltip"]').tooltip();
            showToolTips();
        }else{
            $('[data-toggle="tooltip"]').tooltip('hide');
        }
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
            hoursEl = timeEl.querySelector( '.hours-value' ),
            minutesEl = timeEl.querySelector( '.minutes-value' ),
            secondsEl = timeEl.querySelector( '.seconds-value' ),
            clickAction = timeEl.querySelector( '.action' ),
            actionIcon = clickAction.querySelector( 'i' ),
            actionText = clickAction.querySelector( '.action-label' ),
            resetEl = timeEl.querySelector( '.reset' ),
            countdownFrom = timeEl.dataset.countdown,
            counting = false,
            pausedTime = 0,
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
