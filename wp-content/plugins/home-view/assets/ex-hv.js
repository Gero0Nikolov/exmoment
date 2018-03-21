jQuery( document ).ready( function(){
	if ( jQuery( "body" ).hasClass( "page-template-home-view" ) ) {
		if ( window.location.href.indexOf( "device=server" ) > -1 ) {
			setInterval( function(){ checkHVCommands(); }, 2500 );

			const constraints = {
		  		video: true
			};

			function handleSuccess( stream ) {
				document.querySelector( '#camera-view' ).srcObject = stream;
			}

			function handleError( error ) {
				console.error('Reeeejected!', error);
			}

			navigator.mediaDevices.getUserMedia( constraints ).then( handleSuccess ).catch( handleError );
		} else if ( window.location.href.indexOf( "device=remote" ) > -1 ) {
			setInterval( function(){ checkRHVCommands(); }, 2500 );

			jQuery( "#capture-live-moment" ).on( "click", function(){
				users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
				remote_id = users_remote[ user_id ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "send_server_command",
						command : "homeview_capture_home_"+ remote_id,
						remote_id : remote_id,
						server_id : server_id
					},
					success : function( response ){
						if ( response !== undefined && response != null && response != "" ) {
							result_ = JSON.parse( response );
							console.log( result_ );
						}
					},
					error : function( response ) { console.log( response ); }
				} );
			} );

			jQuery( "#open-library" ).on( "click", function(){
				view_ = "\
				<div id='captures-library' class='captures-library'>\
					<div id='captures-list' class='captures-list'></div>\
					<button id='close-captures' class='back-button'>Close</button>\
				</div>\
				";
				jQuery( "body" ).append( view_ );

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "get_captures"
					},
					success : function( response ) {
						if ( response !== "undefined" && response != "" && response != null ) {
							result_ = JSON.parse( response );
							if ( result_ != false ) {
								for ( result_key in result_ ) {
									capture_ = result_[ result_key ];

									console.log( capture_ );

									view_ = "\
									<a href='"+ capture_ +"' target='_blank' class='capture-anchor'>\
										<div class='capture' style='background-image: url("+ capture_ +");'></div>\
									</a>\
									";
									jQuery( "#captures-library #captures-list" ).append( view_ );
								}
							} else { console.log( result_ ); }
						}
					},
					error : function( response ) { console.log( response ); }
				} );

				jQuery( "#close-captures" ).on( "click", function() { jQuery( "#captures-library" ).remove(); } );
			} );

			jQuery( "#back-app-button" ).on( "click", function(){
				users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
				remote_id = users_remote[ user_id ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "send_server_command",
						command : "homeview_exit",
						remote_id : remote_id,
						server_id : server_id
					},
					success : function( response ){
						if ( response !== undefined && response != null && response != "" ) {
							result_ = JSON.parse( response );
							if ( result_ ) {
								window.location = siteurl +"/play-room/?remote="+ server_id;
							}
						}
					},
					error : function( response ) { console.log( response ); }
				} );
			} );

			jQuery( "#search-trigger" ).on( "keyup", function( e ) {
				if ( e.keyCode == 13 ) {
					query = jQuery( this ).val().trim();
					searchForVideos( query );
				}
			} );
		}
	}
} );

function checkHVCommands() {
	users_server = JSON.parse( localStorage.getItem( "exmoment_users_server" ) );
	server_id = users_server[ user_id ];

	jQuery.ajax( {
		url : ajax_url,
		type : "POST",
		data : {
			action : "get_controller_cmds",
			server_id : server_id
		},
		success : function( response ) {
			if ( response !== undefined && response != "" && response != null ) {
				result_ = JSON.parse( response );
				if ( result_ != false ) {
					for ( command_key in result_ ) {
						command = result_[ command_key ];

						command_action = command.split( " " )[ 0 ];

						executeHVAction( command_action );
					}
				}
			}
		},
		error : function( response ) {
			console.log( response );
		}
	} );
}

function checkRHVCommands() {
	users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
	remote_id = users_remote[ user_id ];

	jQuery.ajax( {
		url : ajax_url,
		type : "POST",
		data : {
			action : "get_remote_cmds",
			remote_id : remote_id
		},
		success : function( response ) {
			if ( response !== undefined && response != "" && response != null ) {
				result_ = JSON.parse( response );
				if ( result_ != false ) {
					for ( command_key in result_ ) {
						command = result_[ command_key ];

						command_action = command.split( " " )[ 0 ];

						executeRHVAction( command_action );
					}
				}
			}
		},
		error : function( response ) {
			console.log( response );
		}
	} );
}

function executeHVAction( command ) {
	if ( command == "homeview_exit" ) {
		window.location = siteurl +"/play-room?server";
	} else if ( command.indexOf( "homeview_capture_home" ) > -1 ) {
		video = document.querySelector( "#camera-view " );
		canvas = document.querySelector( "#camera-view-canvas" );
		img = document.querySelector( "#camera-view-photo" );

		canvas.width = video.videoWidth;
	    canvas.height = video.videoHeight;
	    canvas.getContext('2d').drawImage(video, 0, 0);
	    // Other browsers will fall back to image/png
	    img.src = canvas.toDataURL('image/png');

		// Upload the image
		remote_id = command.split( "homeview_capture_home_" )[ 1 ];
		jQuery.ajax( {
			url : ajax_url,
			type : "POST",
			data : {
				action : "upload_home_view_capture",
				remote_id : remote_id,
				server_id : server_id,
				capture : img.src
			},
			success : function ( response ) {
				if ( response !== undefined && response != "" && response != null ) {
					result_ = JSON.parse( response );
					if ( !result_ ) { console.log( result_ ); }
				}
			},
			error : function ( response ) {
				console.log( response );
			}
		} );
	}
}

function executeRHVAction( command ) {
	if ( command.indexOf( "homeview_show_capture_" ) > -1 ) {
		capture_url = command.split( "homeview_show_capture_" )[ 1 ];
		jQuery( "#last-capture" ).attr( "style", "background-image: url("+ capture_url +");" ).attr( "last-capture-url", capture_url ).addClass( "filled" ).on( "click", function(){
			window.open( jQuery( this ).attr( "last-capture-url" ) );
		} );
	}
}

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
