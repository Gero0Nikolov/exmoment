<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package ExMoment
 */


if ( is_user_logged_in() ) { wp_redirect( get_site_url() ."/dashboard" ); exit; }

$device = wp_is_mobile() ? "mobile" : "desktop";
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

	<?php wp_head(); ?>

	<script type="text/javascript">
	var ajax_url = "<?php echo admin_url( 'admin-ajax.php' ); ?>";
	</script>
</head>

<body <?php body_class( $device ); ?>>
<div id="page" class="site">

	<div id="content" class="site-content">
