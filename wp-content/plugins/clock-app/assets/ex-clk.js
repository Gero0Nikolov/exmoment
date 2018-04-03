jQuery( document ).ready( function(){
	if ( jQuery( "body" ).hasClass( "page-template-clock" ) ) {
		if ( window.location.href.indexOf( "device=server" ) > -1 ) {
			setInterval( function(){ checkCLKCommands(); }, 2500 );

			// Initialize
			viewport_width = document.body.clientWidth;
			viewport_height = document.body.clientHeight;

			// Get Default Backgrounds
			background_view = "<div class='background-view' style='background-image: url(https://picsum.photos/"+ viewport_width +"/"+ viewport_height +"?random);'></div>";
			jQuery( "#backgrounds-list" ).append( background_view );

			// Set current time in 24 hours
			setInterval( function(){
				d = new Date();
				hours = d.getHours() < 10 ? "0"+ d.getHours() : d.getHours();
				minutes = d.getMinutes() < 10 ? "0"+ d.getMinutes() : d.getMinutes();
				jQuery( "#hour" ).html( hours );
				jQuery( "#minute" ).html( minutes );
			}, 1000 );

			// Count alarms
			if ( localStorage.getItem( "exmoment_user_alarms" ) != null ) {
				alarms = JSON.parse( localStorage.getItem( "exmoment_user_alarms" ) );
				count_alarms = alarms.length;
				jQuery( "#alarms #alarms-counter" ).html( count_alarms );
			}
		} else if ( window.location.href.indexOf( "device=remote" ) > -1 ) {
			jQuery( "#back-app-button" ).on( "click", function(){
				users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
				remote_id = users_remote[ user_id ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "send_server_command",
						command : "clock_exit",
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
		}
	}
} );

function checkCLKCommands() {
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

						executeCLKAction( command_action );
					}
				}
			}
		},
		error : function( response ) {
			console.log( response );
		}
	} );
}

function executeCLKAction( command ) {
	if ( command == "clock_exit" ) {
		window.location = siteurl +"/play-room?server";
	}
}
