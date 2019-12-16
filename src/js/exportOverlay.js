$( document ).ready( function(){


	var $featurePageParent = $( '[ data-page="page-elements" ]');
    var $featureInputs = $featurePageParent.find( '.range-slider' );
    var $featureOutputs = $featurePageParent.find( 'output' );
    var $featureInputsLen = $featureInputs.length;

    console.log( 'test input: ', $featureInputs.eq( 2 ) );

    function createExpressionParameterExport() {

    	var output = '';

    	for ( var i = 0; i < $featureInputsLen; i++ ) {
    		var thisInput = $featureInputs.eq( i )[ 0 ];
    		var $thisOutput = parseFloat( $featureOutputs.eq( i ).html() ).toFixed( 2 );

    		thisInput.id === 'mouthEdgeRight' ? $thisOutput = $thisOutput * -1 : false;

    		var tempEnding = '';

    		if ( i !== $featureInputsLen - 1 ) {
    			tempEnding = ',';
    		}

    		output = `${ output }
    		{ name: "${ thisInput.id }", target: "${ $thisOutput }" }${tempEnding}`;
    	}

    	output = `[
    			${ output }
    		]`;

        console.log( 'output: ', output );
    	return output;

    }


	var $exportOverlay = $( '.export-overlay--container' );

	$( '.js-export-expression' ).click( function( e ){

		var $thisButton = $( this );

		if ( $exportOverlay.hasClass( 'is-active') ) {
			$exportOverlay.removeClass( 'is-active' );


		} else {


			$( '.export-overlay--output' ).html( createExpressionParameterExport() );
			$exportOverlay.addClass( 'is-active' );
		}

	} );

	$( '.js-close-export-overlay-limiter' ).click( function( e ){
		e.stopPropagation();
	} );


	$( '.js-close-export-overlay' ).click( function( e ){
		e.stopPropagation();
		var $this = $( this );
		$( '.export-overlay--container' ).removeClass( 'is-active' )
	} );

	


} );