<?php
/*
Plugin Name: YouTube Application
Description: This plugin will add the YouTube app to Exmoment.
Version: 1.0
Author: GeroNikolov
Author URI: http://geronikolov.com
License: GPLv2
*/

class EX_YT {
	function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'ex_yt_js' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'ex_yt_css' ) );
	}

	function __destruct() {}

	function ex_yt_js() {
		wp_enqueue_script( 'ex-yt-js', plugins_url( '/assets/ex-yt.js' , __FILE__ ), array('jquery'), '1.0', true );
	}
	
	function ex_yt_css() {
		wp_enqueue_style( 'ex-yt-css', plugins_url( '/assets/ex-yt.css', __FILE__ ), array(), '1.0', 'screen' );
	}
}

$_EX_YT_ = new EX_YT;
?>
