jQuery( document ).ready( function(){
	if ( jQuery( "body" ).hasClass( "page-template-youtube" ) ) {
		if ( window.location.href.indexOf( "device=server" ) > -1 ) {
			setInterval( function(){ checkYTCommands(); }, 1000 );
		} else if ( window.location.href.indexOf( "device=remote" ) > -1 ) {
			jQuery( "#search-trigger" ).on( "keyup", function( e ) {
				if ( e.keyCode == 13 ) {
					query = jQuery( this ).val().trim();
					searchForVideos( query );
				}
			} );
		}
	}
} );

function searchForVideos( query ) {
	jQuery.ajax({
		url : "https://www.googleapis.com/youtube/v3/search/",
		type : "GET",
		data : {
			key : application_api_key,
			q : query,
			maxResults : 25,
			part : "snippet"
		},
		success : function( response ) {
			if ( response.items.length > 0 ) {
				jQuery( "#search-results" ).html( "" );

				for ( video_key in response.items ) {
					video_ = response.items[ video_key ];

					view = "\
					<div id='video-"+ video_.id.videoId +"' class='video-container'>\
						<div class='video-thumbnail' style='background-image: url("+ video_.snippet.thumbnails.high.url +");'></div>\
						<h1 class='video-title'>"+ video_.snippet.title +"</h1>\
					</div>\
					";

					jQuery( "#search-results" ).append( view );

					jQuery( "#video-"+ video_.id.videoId ).on( "click", function(){
						video_id = jQuery( this ).attr( "id" ).split( "video-" )[ 1 ];
						last_video_id = video_id;

						users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
						remote_id = users_remote[ user_id ];

						jQuery.ajax( {
							url : ajax_url,
							type : "POST",
							data : {
								action : "send_server_command",
								command : "youtube_play "+ video_id,
								remote_id : remote_id,
								server_id : server_id
							},
							success : function( response ) {
								if ( response !== "undefined" && response != "" && response != null ) {
									result_ = JSON.parse( response );
									if ( result_ && jQuery( ".playing-popup" ).length == 0 ) {
										video_thumbnail = jQuery( "#video-"+ last_video_id ).find( ".video-thumbnail" ).attr( "style" );
										video_title = jQuery( "#video-"+ last_video_id ).find( ".video-title" ).html();

										view = "\
										<div id='playing-popup-"+ last_video_id +"' class='playing-popup'>\
											<div class='video-thumbnail' style='"+ video_thumbnail +"'></div>\
											<h1 class='video-title'>Now playing: "+ video_title +"</h1>\
											<button id='replay-video' video-id='"+ last_video_id +"' class='replay-button'>Replay</button>\
											<button id='stop-video' video-id='"+ last_video_id +"' class='stop-button'>Stop</button>\
										</div>\
										";
										jQuery( "body" ).append( view );

										jQuery( "#playing-popup-"+ last_video_id ).find( "#replay-video" ).on( "click", function(){
											jQuery( "#video-"+ last_video_id ).trigger( "click" );
										} );

										jQuery( "#playing-popup-"+ last_video_id ).find( "#stop-video" ).on( "click", function(){
											users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
											remote_id = users_remote[ user_id ];

											jQuery.ajax( {
												url : ajax_url,
												type : "POST",
												data : {
													action : "send_server_command",
													command : "youtube_stop_video",
													remote_id : remote_id,
													server_id : server_id
												},
												success : function( response ) {
													if ( response !== undefined && response != "" && response != null ) {
														result_ = JSON.parse( response );
														console.log( result_ );
														if ( result_ ) {
															jQuery( "#playing-popup-"+ last_video_id ).remove();
															last_video_id = 0;
														}
													}
												},
												error : function( response ) { console.log( response ); }
											} );
										} );
									}
								}
							},
							error : function( response ) {
								console.log( response );
							}
						} );
					} );
				}
			} else {
				jQuery( "#search-results" ).html( "<h1 class='error-message'>Nothing found...</h1>" );
			}
		},
		error : function( response ) {
			console.log( response );
		}
	});
}

function checkYTCommands() {
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
						video_id = command.split( command_action +" " )[ 1 ];

						executeYTAction( command_action, video_id );
					}
				}
			}
		},
		error : function( response ) {
			console.log( response );
		}
	} );
}

function executeYTAction( command, video_id ) {
	if ( command == "youtube_play" ) {
		view_ = "<iframe id='view-stream' src='https://www.youtube.com/embed/"+ video_id +"/?autoplay=1&controls=1' frameborder='0'></iframe>";
		if ( jQuery( "#view-stream" ).length > 0 ) { jQuery( "#view-stream" ).remove(); }
		jQuery( "body" ).append( view_ );
	}

	if ( command == "youtube_stop_video" ) {
		jQuery( "#view-stream" ).remove();
	}
}
