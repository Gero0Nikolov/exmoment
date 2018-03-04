<?php
// Template Name: Pick Server

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
				</div>
			</div>
		</div>

		<?php
	}
	?>
	<button id="back-button" class="back-button">Back</button>
</div>

<?php get_footer( "logged" ); ?>
