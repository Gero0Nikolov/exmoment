<?php
// Template Name: Servers

get_header( "logged" );
?>

<div id="servers-container" class="page-container">
	<?php
	$servers_ = get_servers();
	foreach ( $servers_ as $server_ ) {
		?>

		<div id="server-<?php echo $server_->server_id; ?>" class="row">
			<div class="col">
				<h1 class="server-name"><?php echo $server_->server_name; ?></h1>
			</div>
			<div class="col">
				<div id="controls">
					<button id="remove-server" class="remove-button">Remove</button>
				</div>
			</div>
		</div>

		<?php
	}
	?>
	<button id="back-button" class="back-button">Back</button>
</div>

<?php get_footer( "logged" ); ?>
