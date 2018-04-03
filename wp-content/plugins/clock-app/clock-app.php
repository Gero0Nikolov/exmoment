<?php
/*
Plugin Name: Clock Application
Description: This plugin will add the Clock app to Exmoment.
Version: 1.0
Author: GeroNikolov
Author URI: http://geronikolov.com
License: GPLv2
*/

class CLOCK {
	function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'ex_clock_js' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'ex_clock_css' ) );
	}

	function __destruct() {}

	function ex_clock_js() {
		wp_enqueue_script( 'ex-clock-js', plugins_url( '/assets/ex-clk.js' , __FILE__ ), array('jquery'), '1.0', true );
	}

	function ex_clock_css() {
		wp_enqueue_style( 'ex-clock-css', plugins_url( '/assets/ex-clk.css', __FILE__ ), array(), '1.0', 'screen' );
	}
}

$_CLOCK_ = new CLOCK;
?>
