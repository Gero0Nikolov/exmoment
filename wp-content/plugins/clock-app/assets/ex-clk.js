var add_hour_interval;
var add_minute_interval;
var remove_hour_interval;
var remove_minute_interval;

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

			// Set current time in 24 hours && check for alarms
			setInterval( function(){
				d = new Date();
				hours = d.getHours() < 10 ? "0"+ d.getHours() : d.getHours();
				minutes = d.getMinutes() < 10 ? "0"+ d.getMinutes() : d.getMinutes();
				jQuery( "#hour" ).html( hours );
				jQuery( "#minute" ).html( minutes );

				// Check for alarms
				if ( localStorage.getItem( "exmoment_user_alarms" ) != null ) {
					alarms_ = JSON.parse( localStorage.getItem( "exmoment_user_alarms" ) );
					for ( alarm_key in alarms_ ) {
						alarm_ = alarms_[ alarm_key ];

						alarm_hour = parseInt( alarm_.hour );
						alarm_minutes = parseInt( alarm_.minutes );

						hours = parseInt( hours );
						minutes = parseInt( minutes );

						if ( alarm_hour == hours && alarm_minutes == minutes ) {
							if ( jQuery( "#alarm-popup-"+ alarm_.id ).length == 0 ) {
								jQuery( ".alarm-popup" ).remove();

								view_ = "\
								<div id='alarm-popup-"+ alarm_.id +"' class='alarm-popup'>\
									<div class='alarm-hour'>"+ alarm_.hour +":"+ alarm_.minutes +"</div>\
									<iframe src='"+ alarm_.src +"' class='alarm-video' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>\
								</div>\
								";
								jQuery( "body" ).append( view_ );
							}
						}
					}
				}
			}, 500 );

			// Count alarms
			if ( localStorage.getItem( "exmoment_user_alarms" ) != null ) {
				count_alarms();
			}
		} else if ( window.location.href.indexOf( "device=remote" ) > -1 ) {
			jQuery( "#create-alarm" ).on( "click", function(){
				view_ = "\
				<div id='new-alarm-container' class='new-alarm-container'>\
					<div id='new-alarm-builder' class='new-alarm-builder'>\
						<div class='flex-row'>\
							<div class='col'>\
								<button id='add-hour' class='dashicons dashicons-arrow-up-alt2 alarm-controller'></button>\
								<input type='text' id='hours' class='alarm-input' value='0'>\
								<button id='remove-hour' class='dashicons dashicons-arrow-down-alt2 alarm-controller'></button>\
							</div>\
							<div class='col'>\
								<button id='add-minute' class='dashicons dashicons-arrow-up-alt2 alarm-controller'></button>\
								<input type='text' id='minutes' class='alarm-input' value='0'>\
								<button id='remove-minute' class='dashicons dashicons-arrow-down-alt2 alarm-controller'></button>\
							</div>\
						</div>\
						<input type='text' id='sound-url' placeholder='Put a YouTube video link'>\
					</div>\
					<button id='save-new-alarm' class='add-button'>Save</button>\
					<button id='close-new-alarm-builder' class='back-button'>Close</button>\
				</div>\
				";

				jQuery( "body" ).append( view_ );

				d = new Date();
				hours = d.getHours() < 10 ? "0"+ d.getHours() : d.getHours();
				minutes = d.getMinutes() < 10 ? "0"+ d.getMinutes() : d.getMinutes();

				jQuery( "#hours" ).val( hours );
				jQuery( "#minutes" ).val( minutes );

				jQuery( "#add-hour" ).on( "click", function(){
					hours = parseInt( jQuery( "#hours" ).val() );
					hours = hours < 24 ? hours + 1 : 1;
					hours = hours < 10 ? "0"+ hours : hours;
					jQuery( "#hours" ).val( hours );
				} );

				jQuery( "#remove-hour" ).on( "click", function(){
					hours = parseInt( jQuery( "#hours" ).val() );
					hours = hours > 1 ? hours - 1 : 24;
					hours = hours < 10 ? "0"+ hours : hours;
					jQuery( "#hours" ).val( hours );
				} );

				jQuery( "#add-minute" ).on( "click", function(){
					minutes = parseInt( jQuery( "#minutes" ).val() );
					minutes = minutes < 59 ? minutes + 1 : 0;
					minutes = minutes < 10 ? "0"+ minutes : minutes;
					jQuery( "#minutes" ).val( minutes );
				} );

				jQuery( "#remove-minute" ).on( "click", function(){
					minutes = parseInt( jQuery( "#minutes" ).val() );
					minutes = minutes > 0 ? minutes - 1 : 59;
					minutes = minutes < 10 ? "0"+ minutes : minutes;
					jQuery( "#minutes" ).val( minutes );
				} );

				jQuery( "#add-hour" ).on( "mousedown", function(){
					add_hour_interval = setInterval( function(){
						jQuery( "#add-hour" ).trigger( "click" );
					}, 200 );
				} ).on( "mouseup", function(){ clearInterval( add_hour_interval ); } );

				jQuery( "#remove-hour" ).on( "mousedown", function(){
					remove_hour_interval = setInterval( function(){
						jQuery( "#remove-hour" ).trigger( "click" );
					}, 200 );
				} ).on( "mouseup", function(){ clearInterval( remove_hour_interval ); } );

				jQuery( "#add-minute" ).on( "mousedown", function(){
					add_minute_interval = setInterval( function(){
						jQuery( "#add-minute" ).trigger( "click" );
					}, 200 );
				} ).on( "mouseup", function(){ clearInterval( add_minute_interval ); } );

				jQuery( "#remove-minute" ).on( "mousedown", function(){
					remove_minute_interval = setInterval( function(){
						jQuery( "#remove-minute" ).trigger( "click" );
					}, 200 );
				} ).on( "mouseup", function(){ clearInterval( remove_minute_interval ); } );

				jQuery( "#save-new-alarm" ).on( "click", function(){
					hour = jQuery( "#hours" ).val();
					minutes = jQuery( "#minutes" ).val();
					sound_url = jQuery( "#sound-url" ).val();

					if ( sound_url.indexOf( "youtube.com" ) > -1 || sound_url == "" ) {
						jQuery.ajax( {
							url : ajax_url,
							type : "POST",
							data : {
								action : "create_new_alarm",
								hour : hour,
								minutes : minutes,
								sound_url : sound_url
							},
							success : function( response ) {
								if ( response !== undefined && response != "" && response != null ) {
									result_ = JSON.parse( response );
									if ( result_ ) {
										users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
										remote_id = users_remote[ user_id ];

										jQuery.ajax( {
											url : ajax_url,
											type : "POST",
											data : {
												action : "send_server_command",
												command : "clock_rescrape_alarms",
												remote_id : remote_id,
												server_id : server_id
											},
											success : function( response ){
												if ( response !== undefined && response != null && response != "" ) {
													alert( "Alarm saved successfully!" );
												}
											},
											error : function( response ) { console.log( response ); }
										} );
									}
								}
							},
							error : function( response ) {
								console.log( response );
							}
						} );
					} else { alert( "Put a YouTube video link!" ); }
				} );

				jQuery( "#close-new-alarm-builder" ).on( "click", function(){
					jQuery( "#new-alarm-container" ).remove();
				} );
			} );

			jQuery( "#open-library" ).on( "click", function(){
				view_ = "\
				<div id='alarms-list-container' class='alarms-list-container'>\
					<div id='alarms-list' class='alarms-list'>\
					</div>\
					<button id='close-alarms-list' class='back-button'>Close</button>\
				</div>\
				";

				jQuery( "body" ).append( view_ );

				jQuery( "#close-alarms-list" ).on( "click", function(){
					jQuery( "#alarms-list-container" ).remove();
				} );

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "get_alarms"
					},
					success : function( response ) {
						if ( response !== undefined && response != "" && response != null ) {
							result_ = JSON.parse( response );
							if ( result_ != false ) {
								for ( alarm_key in result_ ) {
									alarm_ = result_[ alarm_key ];

									view_ = "\
									<div id='alarm-"+ alarm_.id +"' class='alarm-row'>\
										<div class='alarm-col'>"+ alarm_.hour +":"+ alarm_.minutes +"</div>\
										<div class='controlls-col'>\
											<button id='remove-alarm' class='dashicons dashicons-trash'></button>\
										</div>\
									</div>\
									";
									jQuery( "#alarms-list-container #alarms-list" ).append( view_ );

									jQuery( "#alarm-"+ alarm_.id +" #remove-alarm" ).on( "click", function(){
										alarm_id = jQuery( this ).parent().parent().attr( "id" ).split( "alarm-" )[ 1 ];

										jQuery.ajax( {
											url : ajax_url,
											type : "POST",
											data : {
												action : "remove_alarm",
												alarm_id : alarm_id
											},
											success : function( response ) {
												if ( response !== undefined && response != "" && response != null ) {
													result_ = JSON.parse( response );
													if ( result_ != false ) {
														jQuery( "#alarm-"+ result_ ).remove();

														users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
														remote_id = users_remote[ user_id ];

														jQuery.ajax( {
															url : ajax_url,
															type : "POST",
															data : {
																action : "send_server_command",
																command : "clock_rescrape_alarms",
																remote_id : remote_id,
																server_id : server_id
															},
															success : function( response ){
																if ( response !== undefined && response != null && response != "" ) {}
															},
															error : function( response ) { console.log( response ); }
														} );
													} else { console.log( result_ ); }
												}
											},
											error : function( response ) {
												console.log( response );
											}
										} );
									} );
								}
							}
						}
					},
					error : function( response ) {
						console.log( response );
					}
				} );
			} );

			jQuery( "#dismiss-alarm" ).on( "click", function(){
				users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
				remote_id = users_remote[ user_id ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "send_server_command",
						command : "clock_dismiss_alarm",
						remote_id : remote_id,
						server_id : server_id
					},
					success : function( response ){
						if ( response !== undefined && response != null && response != "" ) { alert( "Alarm was dismissed!" ); }
					},
					error : function( response ) { console.log( response ); }
				} );
			} );

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
						application = typeof( command.split( " " )[ 1 ] ) != "undefined" ? command.split( " " )[ 1 ] : "";

						executeCLKAction( command_action, application );
					}
				}
			}
		},
		error : function( response ) {
			console.log( response );
		}
	} );
}

function executeCLKAction( command, application ) {
	if ( command == "clock_exit" ) {
		window.location = siteurl +"/play-room?server";
	} else if ( command == "clock_rescrape_alarms" ) {
		jQuery.ajax( {
			url : ajax_url,
			type : "POST",
			data : {
				action : "get_alarms"
			},
			success : function( response ) {
				if ( response !== undefined && response != "" && response != null ) {
					result_ = JSON.parse( response );
					if ( result_ != false || result_.length == 0 ) {
						localStorage.setItem( "exmoment_user_alarms", response );
						count_alarms();
					} else { console.log( result_ ); }
				}
			},
			error : function( response ) { console.log( response ); }
		} );
	} else if ( command == "clock_dismiss_alarm" ) {
		jQuery( ".alarm-popup" ).each( function(){
			jQuery( this ).addClass( "hidden" ).find( ".alarm-video" ).remove();
		} );
	} else if ( command.indexOf( "open" ) > -1 ) {
		if ( window.location.href.indexOf( application ) == -1 ) {
			window.location = siteurl +"/play-room?server&goto="+ application;
		}
	}
}

function count_alarms() {
	alarms = JSON.parse( localStorage.getItem( "exmoment_user_alarms" ) );
	count_ = alarms.length;
	jQuery( "#alarms #alarms-counter" ).html( count_ );
}
