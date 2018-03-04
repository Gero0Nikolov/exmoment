<?php
// Template Name: Remotes

get_header( "logged" );
?>

<div id="remotes-container" class="page-container">
	<?php
	$remotes_ = get_remotes();
	foreach ( $remotes_ as $remote_ ) {
		?>

		<div id="remote-<?php echo $remote_->remote_id; ?>" class="row">
			<div class="col">
				<h1 class="remote-name"><?php echo $remote_->remote_name; ?></h1>
			</div>
			<div class="col">
				<div id="controls">
					<button id="remove-remote" class="remove-button">Remove</button>
				</div>
			</div>
		</div>

		<?php
	}
	?>
	<button id="back-button" class="back-button">Back</button>
</div>

<?php get_footer( "logged" ); ?>
