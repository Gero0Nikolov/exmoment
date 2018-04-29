jQuery( document ).ready( function(){
	jQuery( "#back-button" ).on( "click", function(){
		window.location = siteurl;
	} );

	// Set GLOBALS
	if ( typeof( localStorage.getItem( "exmoment_users_server" ) ) == "undefined" || localStorage.getItem( "exmoment_users_server" ) == null ) {
		localStorage.setItem( "exmoment_users_server", JSON.stringify( {} ) );
	}

	if ( typeof( localStorage.getItem( "exmoment_users_remote" ) ) == "undefined" || localStorage.getItem( "exmoment_users_remote" ) == null ) {
		localStorage.setItem( "exmoment_users_remote", JSON.stringify( {} ) );
	}

	if ( jQuery( "#dashboard-container" ).length > 0 ) {
		// Show Play button if the machine is Server || Remote
		users_server = JSON.parse( localStorage.getItem( "exmoment_users_server" ) );
		users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );

		if ( typeof( users_server[ user_id ] ) != "undefined" && users_server[ user_id ] != -1 ) {
			play_button = "<button id='play-button-server' class='play-button'>Play</button>";
			jQuery( "#separete-row" ).prepend( play_button );
		} else if ( typeof( users_remote[ user_id ] ) != "undefined" && users_remote[ user_id ] != -1 ) {
			play_button = "<button id='play-button-remote' class='play-button'>Play</button>";
			jQuery( "#separete-row" ).prepend( play_button );
		}

		// Initialize controls
		jQuery( "#add-server" ).on( "click", function(){
			users_server = JSON.parse( localStorage.getItem( "exmoment_users_server" ) );
			if ( typeof( users_server[ user_id ] ) != "undefined" && users_server[ user_id ] != -1 ) { alert( "This machine is already set as Server! Please remove it before you can set it as server!" ); }
			else { window.location = siteurl +"/add-server"; }
		} );

		jQuery( "#show-server" ).on( "click", function(){
			window.location = siteurl +"/servers";
		} );

		jQuery( "#add-remote" ).on( "click", function(){
			users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
			if ( typeof( users_remote[ user_id ] ) != "undefined" && users_remote[ user_id ] != -1 ) { alert( "This machine is already set as Remote! Please remove it before you can set it as remote!" ); }
			else { window.location = siteurl +"/add-remote"; }
		} );

		jQuery( "#show-remotes" ).on( "click", function(){
			window.location = siteurl +"/remotes";
		} );

		if ( jQuery( "#play-button-server" ).length > 0 ) {
			jQuery( "#play-button-server" ).on( "click", function(){
				window.open( siteurl +"/play-room?server", "_blank" );
			} );
		}

		if ( jQuery( "#play-button-remote" ).length > 0 ) {
			jQuery( "#play-button-remote" ).on( "click", function(){
				window.location = siteurl +"/pick-server";
			} );
		}
	}

	if ( jQuery( "#add-server-container" ).length > 0 ) {
		jQuery( "#add-server" ).on( "click", function(){
			server_name = jQuery( "#server-name" ).val().trim();

			flag = false;

			if ( server_name.length > 15 ) {
				flag = true;
				alert( "Server name should be less than 15 characters!" );
			}

			if ( server_name.length == 0 ) {
				flag = true;
				alert( "Give a name to this server!" );
			}

			if ( !flag ) {
				if ( typeof( localStorage.getItem( "exmoment_users_server" ) ) == "undefined" || localStorage.getItem( "exmoment_users_server" ) == null ) {
					localStorage.setItem( "exmoment_users_server", JSON.stringify( {} ) );
				}

				users_server = JSON.parse( localStorage.getItem( "exmoment_users_server" ) );
				if ( typeof( users_server[ user_id ] ) != "undefined" && users_server[ user_id ] != -1 ) {
					alert( "This machine is already set as a server! Please remove it to add it again." );
				} else {
					jQuery.ajax( {
						url : ajax_url,
						type : "POST",
						data : {
							action : "add_server",
							server_name : server_name
						},
						success : function ( response ) {
							if ( response !== undefined && response != "" && response != null ) {
								result_ = JSON.parse( response );
								if ( result_ != false ) {
									users_server[ user_id ] = result_;
									localStorage.setItem( "exmoment_users_server", JSON.stringify( users_server ) );
									alert( "Server was added successfully!" );
									jQuery( "#back-button" ).trigger( "click" );
								} else { alert( "Something went wrong :(" ); }
							}
						},
						error : function ( response ) {
							console.log( response );
						}
					} );
				}
			}
		} );
	}

	if ( jQuery( "#add-remote-container" ).length > 0 ) {
		jQuery( "#add-remote" ).on( "click", function(){
			remote_name = jQuery( "#remote-name" ).val().trim();

			flag = false;

			if ( remote_name.length > 15 ) {
				flag = true;
				alert( "Remote name should be less than 15 characters!" );
			}

			if ( remote_name.length == 0 ) {
				flag = true;
				alert( "Give a name to this remote!" );
			}

			if ( !flag ) {
				if ( typeof( localStorage.getItem( "exmoment_users_remote" ) ) == "undefined" || localStorage.getItem( "exmoment_users_remote" ) == null ) {
					localStorage.setItem( "exmoment_users_remote", JSON.stringify( {} ) );
				}

				users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
				if ( typeof( users_remote[ user_id ] ) != "undefined" && users_remote[ user_id ] != -1 ) {
					alert( "This machine is already set as a remote! Please remove it to add it again." );
				} else {
					jQuery.ajax( {
						url : ajax_url,
						type : "POST",
						data : {
							action : "add_remote",
							remote_name : remote_name
						},
						success : function ( response ) {
							if ( response !== undefined && response != "" && response != null ) {
								result_ = JSON.parse( response );
								if ( result_ != false ) {
									users_remote[ user_id ] = result_;
									localStorage.setItem( "exmoment_users_remote", JSON.stringify( users_remote ) );
									alert( "Remote was added successfully!" );
									jQuery( "#back-button" ).trigger( "click" );
								} else { alert( "Something went wrong :(" ); }
							}
						},
						error : function ( response ) {
							console.log( response );
						}
					} );
				}
			}
		} );
	}

	if ( jQuery( "#servers-container" ).length > 0 ) {
		users_server = JSON.parse( localStorage.getItem( "exmoment_users_server" ) );
		users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );

		this_machine_id = -1;
		if ( typeof( users_server[ user_id ] ) != "undefined" && users_server[ user_id ] != -1 ) { this_machine_id = users_server[ user_id ]; }

		this_remote_id = -1;
		if ( typeof( users_remote[ user_id ] ) != "undefined" && users_remote[ user_id ] != -1 ) { this_remote_id = users_remote[ user_id ]; }

		jQuery( "#servers-container .row" ).each( function(){
			server_id = jQuery( this ).attr( "id" ).split( "-" )[ 1 ];

			if ( server_id != this_machine_id ) {
				if ( this_remote_id != -1 ) {
					control_button = "<button id='controll-"+ server_id +"' class='control-button'>Control</button>";
					jQuery( this ).find( "#controls" ).prepend( control_button );

					// Set the control action
					jQuery( this ).find( "#controls .control-button" ).on( "click", function(){
						server_id = jQuery( this ).attr( "id" ).split( "-" )[ 1 ];
						window.location = siteurl +"/play-room/?remote="+ server_id;
					} );
				}

				jQuery( this ).find( "#controls" ).find( ".remove-button" ).remove();
			}

			// Set remove action
			jQuery( this ).find( "#controls" ).find( ".remove-button" ).on( "click", function(){
				server_id = jQuery( this ).parent().parent().parent().attr( "id" ).split( "-" )[ 1 ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "remove_server",
						server_id : server_id
					},
					success : function ( response ) {
						if ( response !== "undefined" && response != "" && response != null ) {
							result_ = JSON.parse( response );
							if ( result_ != false ) {
								jQuery( "#server-"+ result_ ).remove();
								users_server = JSON.parse( localStorage.getItem( "exmoment_users_server" ) );
								users_server[ user_id ] = -1;
								localStorage.setItem( "exmoment_users_server", JSON.stringify( users_server ) );
							}
						}
					},
					error : function ( response ) { console.log( response ); }
				} );
			} );
		} );
	}

	if ( jQuery( "#remotes-container" ).length > 0 ) {
		users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );

		this_remote_id = -1;
		if ( typeof( users_remote[ user_id ] ) != "undefined" && users_remote[ user_id ] != -1 ) { this_remote_id = users_remote[ user_id ]; }

		jQuery( "#remotes-container .row" ).each( function(){
			remote_id = jQuery( this ).attr( "id" ).split( "-" )[ 1 ];

			if ( remote_id != this_remote_id ) {
				jQuery( this ).find( "#controls" ).find( ".remove-button" ).remove();
			}

			// Set remove action
			jQuery( this ).find( "#controls" ).find( ".remove-button" ).on( "click", function(){
				remote_id = jQuery( this ).parent().parent().parent().attr( "id" ).split( "-" )[ 1 ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "remove_remote",
						remote_id : remote_id
					},
					success : function ( response ) {
						if ( response !== "undefined" && response != "" && response != null ) {
							result_ = JSON.parse( response );
							if ( result_ != false ) {
								jQuery( "#remote-"+ result_ ).remove();
								users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
								users_remote[ user_id ] = -1;
								localStorage.setItem( "exmoment_users_remote", JSON.stringify( users_remote ) );
							}
						}
					},
					error : function ( response ) { console.log( response ); }
				} );
			} );
		} );
	}
} );
