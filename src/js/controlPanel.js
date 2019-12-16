let overlayCfg = require('./overlay.js').overlayCfg;
let sunSpikes = require('./sunSpikes.js');



$( document ).ready( function(){

	let pageAnimClassList = 'is-active to-left from-left to-right from-right';
		$( '.js-page-select' ).click( function( e ){
		let $thisButton = $( this );
		let selectsPage = $thisButton.attr( 'data-page-select' );
		let $currentPage = $( '.control--panel__page.is-active');
		let currentPageOrder = $( '.control--panel__page' ).attr( 'data-page-order' );
		let $newPage = $( '[data-page="'+selectsPage+'"]');
		let newPageOrder = $newPage.attr( 'data-page-order' );
		let isNewPageOrderGreater = newPageOrder > currentPageOrder ? true : false;
		let introClass = isNewPageOrderGreater ? 'from-right' : 'from-left';
		let outroClass = isNewPageOrderGreater ? 'to-left' : 'to-right';
		if ( $thisButton.hasClass( 'is-active') ) {
			return;
		} else {

			$currentPage.removeClass( pageAnimClassList ).addClass( outroClass );
			$thisButton.addClass( 'is-active' ).siblings().removeClass( 'is-active' );
			$newPage.addClass( 'is-active '+introClass );
		}

	} );




	let $controlPages = $( '.control--panel__page' );
	let $controlSections = $( '.control--panel__section' );
	let numSections = $controlSections.length - 1;
	$controlSections.addClass( '.is-active' );
	$controlPages.addClass( '.is-active' );

	$controlPages.css( {
		'transition-duration': '0s',
		'height': 'auto',
		'position': 'relative',
		'overflow': 'initial'
	} );

	for (let i = numSections; i >= 0; i--) {
		let $thisSection = $controlSections.eq( i );
		let $thisAnimatedEl = $thisSection.find( 'fieldset' );
		$thisAnimatedEl.css( {
			'transition-duration': '0s',
			'height': 'auto'
		} );

		let getHeight =  $thisAnimatedEl.outerHeight();

		$thisAnimatedEl.removeAttr( 'style' );

		$thisSection.attr('data-open-height', getHeight );
	}

	$controlSections.removeClass( '.is-active' );
	$controlPages.removeClass( '.is-active' );
	$controlPages.removeAttr( 'style' );


	$( '.js-section-toggle' ).click( function( e ){
		let $parent = $( this ).closest( '.control--panel__section' );
		let parentActive = $parent.hasClass( 'is-active' ) ? true : false;
		let thisHeight = $parent.attr( 'data-open-height' );
		if ( parentActive ) {
			$parent.removeClass( 'is-active' ).find( 'fieldset' ).css( {
				'height': '0'
			} ) ;
		} else {
			$parent.addClass( 'is-active' ).find( 'fieldset' ).css( {
				'height': thisHeight+'px'
			} );
		}

	} );


	$( '.button-list button' ).click( function( e ){
		let $el = $( this );
		let $siblings = $el.closest( '.button-list' ).find( 'button' );
		let isActive = $el.hasClass( 'is-active' ) ? true : false;

		if ( isActive ) {
			$el.removeClass( 'is-active' );
		} else {
			$siblings.removeClass( 'is-active' );
			$el.addClass( 'is-active' );
		}

	} );

	// get current selected animation speed
	// let initSpeedVal = $( '.js-speed-list button.selected').attr( 'data-anim-speed' );
	// console.log( 'initSpeedVal: ', initSpeedVal );
	// $( '.js-custom-anim-speed-input' ).val( initSpeedVal );

	// $( '.js-custom-anim-speed-input' ).on( 'blur', function( e) {
	// 	// get element
	// 	let $el = $( this );
	// 	// get min/max value
	// 	let maxVal = $el.attr( 'max' );
	// 	let minVal = $el.attr( 'min' );
		// get value
	// 	let value = $el.val();

	// 	if ( value > maxVal ) {
	// 		$el.val( maxVal );
	// 	} else {
	// 		if ( value < minVal ) {
	// 			$el.val( minVal );
	// 		} else {
	// 			$el.val( parseFloat( value ).toFixed( 1 ) );
	// 		}
	// 	}
	// } );


	// $( '.js-anim-speed' ).click( function( e ) {
	// 	// get element
	// 	let $el = $( this );
	// 	// get value
	// 	let value = $el.attr( 'data-anim-speed' );

	// 	$( '.js-custom-anim-speed-input' ).val( value );
	// 	$el.off();

	// } );


	// slider controls for individual facial features
	$( '.page-elements .range-slider' ).on( 'input', function( e ) {
		console.log( 'slider processing is firing' );
		// get element
		let $el = $( this );
		// get output el
		let $outputEl = $el.closest( '.control--panel__item' ).find( 'output' );
		// get min/max value
		let maxVal = $el.attr( 'max' );
		let minVal = $el.attr( 'min' );
		// get value
		let value = $el.val();
		let output = 0;

		if ( minVal < 0 ) {
			value < 0 ? output = value / minVal : output = ( value / maxVal ) * -1;
		} else {
			output = value / maxVal;
		}

		$outputEl.html( parseFloat( output ).toFixed( 2 ) );
	} );


	// slider controls for glare spikes
	$( '.js-glare-spike-effects .range-slider' ).on( 'input', function( e ) {
		console.log( 'slider processing is firing' );
		// get element
		let $el = $( this );
		// 	// get output el
		let $outputEl = $el.closest( '.control--panel__item' ).find( 'output' );
		// get value
		let value = $el.val();
		// flip value if range is flipped (display purposes only)
		$outputEl.html( parseFloat( value ).toFixed( 2 ) );
	} );



	$( '.js-display-controls button' ).click( function( e ){
		var $el = $( this );
		var $siblings = $el.siblings();
		var isActive = $el.hasClass( 'is-active' ) ? true : false;

		var thisDisplayItem = $el.data( 'display-item' );

		if ( isActive ) {
			$el.removeClass( 'is-active' );
			overlayCfg[ thisDisplayItem ] = false;

			if ( !$siblings.hasClass( 'is-active' ) ) {
				overlayCfg.displayOverlay = false;
			}


		} else {
			$el.addClass( 'is-active' );

			if ( !overlayCfg.displayOverlay ) {
				overlayCfg.displayOverlay = true;
			}

			overlayCfg[ thisDisplayItem ] = true;
		}

		if ( thisDisplayItem === 'displayGlareSpikes' ) {
			sunSpikes.clearRenderCtx();
			sunSpikes.renderGlareSpikes();
		}

	} );


} );
