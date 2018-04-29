<?php
// Template Name: Dashboard
get_header( "logged" );

$page_id = get_the_ID();
$background = get_the_post_thumbnail_url( $page_id, "full" );
?>

<div id="dashboard-container" style="background-image: url('<?php echo $background; ?>');">
	<div id="separete-row">
		<a href="<?php echo wp_logout_url( get_site_url() ); ?>" class="logout-button">Logout</a>
	</div>
	<div class="row">
		<div id="add-server" class="option">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/add.png" class="icon" />
			<h1 class="title">Add server</h1>
		</div>
		<div id="show-server" class="option">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/servers.png" class="icon" />
			<h1 class="title">Servers</h1>
		</div>
	</div>
	<div class="row">
		<div id="add-remote" class="option">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/add.png" class="icon" />
			<h1 class="title">Add remote</h1>
		</div>
		<div id="show-remotes" class="option">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/remotes.png" class="icon" />
			<h1 class="title">Remotes</h1>
		</div>
	</div>
</div>

<?php get_footer( "logged" ); ?>
