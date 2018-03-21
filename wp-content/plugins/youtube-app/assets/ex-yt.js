jQuery( document ).ready( function(){
	if ( jQuery( "body" ).hasClass( "page-template-youtube" ) ) {
		if ( window.location.href.indexOf( "device=server" ) > -1 ) {
			setInterval( function(){ checkYTCommands(); }, 1000 );
		} else if ( window.location.href.indexOf( "device=remote" ) > -1 ) {
			jQuery( "#back-app-button" ).on( "click", function(){
				users_remote = JSON.parse( localStorage.getItem( "exmoment_users_remote" ) );
				remote_id = users_remote[ user_id ];

				jQuery.ajax( {
					url : ajax_url,
					type : "POST",
					data : {
						action : "send_server_command",
						command : "youtube_exit",
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
						playVideo( video_id );
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

	if ( command == "youtube_exit" ) {
		window.location = siteurl +"/play-room?server";
	}
}

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return (duration * 1000) + 1000;
}

function playVideo( video_id, replay = false ) {
	last_video_id = video_id;

	if ( !replay ) {
		video_thumbnail = jQuery( "#video-"+ last_video_id ).find( ".video-thumbnail" ).attr( "style" );
		video_title = jQuery( "#video-"+ last_video_id ).find( ".video-title" ).html();
	}

	jQuery.ajax( {
		url : "https://www.googleapis.com/youtube/v3/videos",
		type : "GET",
		data : {
			key : application_api_key,
			id : video_id,
			part : "contentDetails"
		},
		success : function( response ){
			jQuery( ".playing-popup" ).remove();

			if ( response.items.length > 0 ) {
				last_video_length = convert_time( response.items[ 0 ].contentDetails.duration );

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
							// Build playing popup
							result_ = JSON.parse( response );
							if ( result_ && jQuery( ".playing-popup" ).length == 0 ) {
								view = "\
								<div id='playing-popup-"+ last_video_id +"' class='playing-popup'>\
									<div class='video-thumbnail' style='"+ video_thumbnail +"'></div>\
									<h1 class='video-title'>Now playing: "+ video_title +"</h1>\
									<button id='replay-video' video-id='"+ last_video_id +"' class='replay-button'>Replay</button>\
									<button id='stop-video' video-id='"+ last_video_id +"' class='stop-button'>Stop</button>\
									<div id='up-next'>\
										<h1 class='up-next-title'>Up next:</h1>\
									</div>\
									<div id='related-videos'>\
										<h1 class='suggested-title'>Suggested:</h1>\
									</div>\
								</div>\
								";
								jQuery( "body" ).append( view );

								// Get related videos
								jQuery.ajax( {
									url : "https://www.googleapis.com/youtube/v3/search",
									type : "GET",
									data : {
										key : application_api_key,
										part : "snippet",
										relatedToVideoId : last_video_id,
										type : "video"
									},
									success : function( response ) {										
										if ( response.items.length > 0 ) {
											next_video = response.items[ 0 ];

											view_ = "\
											<div id='video-"+ next_video.id.videoId +"' class='video-container'>\
												<div class='video-thumbnail' style='background-image: url("+ next_video.snippet.thumbnails.high.url +");'></div>\
												<h1 class='video-title'>"+ next_video.snippet.title +"</h1>\
											</div>\
											";
											jQuery( "#up-next" ).append( view_ );

											jQuery( "#video-"+ next_video.id.videoId ).on( "click", function() {
												video_id = jQuery( this ).attr( "id" ).split( "video-" )[ 1 ];
												playVideo( video_id );
											} );

											// Set playing interval
											playing_interval = setTimeout( function(){ playNextVideo(); }, last_video_length );

											for ( i = 1; i < response.items.length; i++ ) {
												video_ = response.items[ i ];

												view = "\
												<div id='video-"+ video_.id.videoId +"' class='video-container'>\
													<div class='video-thumbnail' style='background-image: url("+ video_.snippet.thumbnails.high.url +");'></div>\
													<h1 class='video-title'>"+ video_.snippet.title +"</h1>\
												</div>\
												";

												jQuery( "#related-videos" ).append( view );

												jQuery( "#video-"+ video_.id.videoId ).on( "click", function(){
													video_id = jQuery( this ).attr( "id" ).split( "video-" )[ 1 ];
													playVideo( video_id );
												} );
											}
										}
									},
									error : function( response ) {
										console.log( response );
									}
								} );

								// Controls
								jQuery( "#playing-popup-"+ last_video_id ).find( "#replay-video" ).on( "click", function(){
									playVideo( last_video_id, true );
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
												if ( result_ ) {
													jQuery( "#playing-popup-"+ last_video_id ).remove();
													last_video_id = 0;
													last_video_length = 0;
													clearTimeout( playing_interval );
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
			}
		},
		error : function( response ){
			console.log( response );
		}
	} );
}

function playNextVideo() {
	clearTimeout( playing_interval );
	jQuery( ".playing-popup #up-next .video-container" ).trigger( "click" );
}
