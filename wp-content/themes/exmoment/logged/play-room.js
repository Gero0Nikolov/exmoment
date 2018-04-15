jQuery( document ).ready( function(){
	if ( jQuery( "#play-room" ).length > 0 && window.location.href.indexOf( "server" ) > -1 ) {
		initServer();
		setInterval( function(){ checkCommands(); }, 1000 );
	}

	if ( jQuery( "#play-room" ).length > 0 && window.location.href.indexOf( "remote" ) > -1 ) {
		initRemote();
	}
} );

function checkCommands() {
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
						command_application = command.split( command_action +" " )[ 1 ];

						executeAction( command_action, command_application );
					}
				}
			}
		},
		error : function( response ) {
			console.log( response );
		}
	} );
}

function initServer() {
	jQuery( ".application-container" ).each( function(){
		jQuery( this ).on( "click", function(){
			application_name = jQuery( this ).attr( "id" ).split( "app-" )[ 1 ];
			window.location = siteurl +"/"+ application_name +"-app?device=server";
		} );
	} );

	// Check for go to command
	if ( window.location.href.indexOf( "goto" ) > -1 ) {
		application = window.location.href.split( "goto=" )[ 1 ];		
		jQuery( "#app-"+ application ).trigger( "click" );
	}
}

function initRemote() {
	jQuery( ".application-container" ).each( function(){
		jQuery( this ).on( "click", function(){
			users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
			remote_id = users_remote[ user_id ];

			app_name = jQuery( this ).attr( "id" ).split( "app-" )[ 1 ];
			jQuery.ajax( {
				url : ajax_url,
				type : "POST",
				data : {
					action : "send_server_command",
					command : "open "+ app_name,
					remote_id : remote_id,
					server_id : server_id
				},
				success : function( response ) {
					window.location = siteurl +"/"+ app_name +"-app?device=remote&server_id="+ server_id;
				},
				error : function( response ) {
					console.log( response );
				}
			} );
		} );
	} );
}

function executeAction( command, application ) {
	if ( command == "open" ) {
		jQuery( "#app-"+ application ).trigger( "click" );
	}
}
