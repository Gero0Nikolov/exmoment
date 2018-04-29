jQuery( document ).ready( function(){
	jQuery( "#submit-email" ).on( "click", function(){
		email = jQuery( "#email" ).val().trim();

		jQuery.ajax( {
			url : ajax_url,
			type : "POST",
			data : {
				action : "email_request",
				email : email
			},
			success : function ( response ) {
				if ( response !== "undefined" && response != "" && response != null ) {
					result_ = JSON.parse( response );
					if ( result_ != false ) {
						alert( "Thank you! We will contact you soon." );
					} else {
						alert( "Something is wrong with your email!" );
					}
				}
			},
			error : function ( response ) {
				console.log( response );
			}
		} );
	} );

	jQuery( "#email" ).on( "keyup", function( e ){
		if ( e.keyCode == 13 ) {
			jQuery( "#submit-email" ).trigger( "click" );
		}
	} );
} );
