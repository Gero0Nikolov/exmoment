<?php
// Template Name: Home View

$device = isset( $_GET[ "device" ] ) && !empty( $_GET[ "device" ] ) ? sanitize_text_field( $_GET[ "device" ] ) : "";
$server_id = isset( $_GET[ "server_id" ] ) && !empty( $_GET[ "server_id" ] ) ? sanitize_text_field( $_GET[ "server_id" ] ) : "";
if ( $device != "" ) {
	get_header( "logged" );

	$page_id = get_the_ID();
	$application = get_field( "application", $page_id );
	?>

	<div id="default-view" class="<?php echo $device == "server" ? "" : "hidden"; ?>">
		<video id="camera-view" autoplay="autoplay"></video>
		<img id="camera-view-photo" src="" class="hidden" />
		<canvas id="camera-view-canvas" style="display: none;"></canvas>
	</div>
	<div id="app-view" class="<?php echo $device == "server" ? "hidden" : ""; ?>">
		<?php if ( $device == "remote" ) { ?>
			<div id="last-capture"></div>
			<button id="capture-live-moment" class="add-button">Capture home</button>
			<button id="open-library" class="open-library">Open Library</button>
			<button id="back-app-button" class="back-button">Back</button>
		<?php } ?>
	</div>
	<script type="text/javascript">
	var server_id = "<?php echo $server_id; ?>";
	var admin_post_url = '<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>';
	</script>

<?php
	get_footer( "logged" );
} else { wp_redirect( get_siteurl() ); }
?>
