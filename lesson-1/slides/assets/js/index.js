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

    });


    Reveal.addEventListener( 'fragmentshown', function( fragmentShownEvent ) {

        // Allows us to simultaneously highlight code with normal fragments
        highlightSimultaneous( fragmentShownEvent );
    } );




    function checkAndShowSneakyTags(slideChangeEvent){
        var highlightTitles = slideChangeEvent.currentSlide.querySelectorAll('.hljs-title');

        highlightTitles = Array.prototype.slice.call(highlightTitles, 0);

        highlightTitles.forEach(function(element){
            if(element.textContent.indexOf('.') == (element.textContent.length - 1)){

                element.textContent = element.textContent.slice(0, -1);
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
