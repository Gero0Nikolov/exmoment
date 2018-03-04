<?php
// Template Name: Play Room

get_header( "logged" );

$server_id = isset( $_GET[ "remote" ] ) && !empty( $_GET[ "remote" ] ) ? sanitize_text_field( $_GET[ "remote" ] ) : 0;
?>

<div id="play-room">
	<div class="applications-container">
<?php
$args = array(
	"posts_per_page" => -1,
	"post_type" => "applications",
	"post_status" => "publish",
	"orderby" => "ID",
	"order" => "DESC"
);
$posts_ = get_posts( $args );

foreach ( $posts_ as $post_ ) {
	$application_icon = get_the_post_thumbnail_url( $post_->ID, "full" );
	$application_folder = $post_->post_name;
	?>

	<div id="app-<?php echo $post_->post_name; ?>" class="application-container">
		<img src="<?php echo $application_icon; ?>" class="application-icon" />
	</div>

	<?php
}
?>
	</div>
</div>
<script type="text/javascript">
var app_name = "";
var server_id = "<?php echo $server_id; ?>";
</script>

<?php
get_footer( "logged" );
?>
