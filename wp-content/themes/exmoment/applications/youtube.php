<?php
// Template Name: YouTube

$device = isset( $_GET[ "device" ] ) && !empty( $_GET[ "device" ] ) ? sanitize_text_field( $_GET[ "device" ] ) : "";
$server_id = isset( $_GET[ "server_id" ] ) && !empty( $_GET[ "server_id" ] ) ? sanitize_text_field( $_GET[ "server_id" ] ) : "";
if ( $device != "" ) {
	get_header( "logged" );

	$page_id = get_the_ID();
	$application = get_field( "application", $page_id );
	$application_api_key = get_field( "application_api_key", $application->ID );
	?>

	<div id="default-view" class="<?php echo $device == "server" ? "" : "hidden"; ?>">
		<?php
		if ( $device == "server" ) {
			$application_icon = get_the_post_thumbnail_url( $application->ID, "full" );
			?>

			<img src="<?php echo $application_icon; ?>" class="application-icon" />
			<h1 class="application-content"><?php echo $application->post_content; ?></h1>

			<?php
		}
		?>
	</div>
	<div id="app-view" class="<?php echo $device == "server" ? "hidden" : ""; ?>">
		<?php if ( $device == "remote" ) { ?>
		<input type="text" placeholder="Search for videos..." id="search-trigger">
		<div id="search-results"></div>
		<?php } ?>
	</div>
	<script type="text/javascript">
	var application_api_key = "<?php echo $application_api_key; ?>";
	var server_id = "<?php echo $server_id; ?>";
	var last_video_id = 0;
	</script>

<?php
	get_footer( "logged" );
} else { wp_redirect( get_siteurl() ); }
?>
