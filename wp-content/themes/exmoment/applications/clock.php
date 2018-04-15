<?php
// Template Name: Clock

$device = isset( $_GET[ "device" ] ) && !empty( $_GET[ "device" ] ) ? sanitize_text_field( $_GET[ "device" ] ) : "";
$server_id = isset( $_GET[ "server_id" ] ) && !empty( $_GET[ "server_id" ] ) ? sanitize_text_field( $_GET[ "server_id" ] ) : "";

if ( $device != "" ) {
	get_header( "logged" );

	$page_id = get_the_ID();
	$application = get_field( "application", $page_id );
	?>

	<div id="default-view" class="<?php echo $device == "server" ? "" : "hidden"; ?>">
		<div id="clock-view">
			<div id="backgrounds-list"></div>
			<div id="clock-container">
				<div id="clock">
					<span id="hour" class="clock-label">0</span>
					<span class="clock-label separator"></span>
					<span id="minute" class="clock-label">0</span>
				</div>
				<div id="alarms"><span id="alarms-counter">0</span> alarms</div>
			</div>
		</div>
	</div>
	<div id="app-view" class="<?php echo $device == "server" ? "hidden" : ""; ?>">
		<?php if ( $device == "remote" ) { ?>
			<button id="create-alarm" class="add-button">New Alarm</button>
			<button id="open-library">All Alarms</button>
			<button id="dismiss-alarm">Dismiss Alarm</button>
			<button id="back-app-button" class="back-button">Back</button>
		<?php } ?>
	</div>
	<script type="text/javascript">
	var server_id = "<?php echo $server_id; ?>";
	var last_active_background = 0;
	</script>

<?php
	get_footer( "logged" );
} else { wp_redirect( get_site_url() ); }
?>
