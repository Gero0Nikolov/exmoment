<?php
/*
Plugin Name: Home View Application
Description: This plugin will add the Home View app to Exmoment.
Version: 1.0
Author: GeroNikolov
Author URI: http://geronikolov.com
License: GPLv2
*/

class EX_HV {
	function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'ex_hv_js' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'ex_hv_css' ) );

		add_action( 'wp_ajax_upload_home_view_capture', array( $this, 'upload_home_view_capture' ) );
		add_action( 'wp_ajax_nopriv_upload_home_view_capture', array( $this, 'upload_home_view_capture' ) );

		add_action( 'wp_ajax_get_captures', array( $this, 'get_captures' ) );
		add_action( 'wp_ajax_nopriv_get_captures', array( $this, 'get_captures' ) );
	}

	function __destruct() {}

	function ex_hv_js() {
		wp_enqueue_script( 'ex-hv-js', plugins_url( '/assets/ex-hv.js' , __FILE__ ), array('jquery'), '1.0', true );
	}

	function ex_hv_css() {
		wp_enqueue_style( 'ex-hv-css', plugins_url( '/assets/ex-hv.css', __FILE__ ), array(), '1.0', 'screen' );
	}

	function upload_home_view_capture() {
		$capture = isset( $_POST[ "capture" ] ) && !empty( $_POST[ "capture" ] ) ? base64_decode( str_replace( " ", "+", str_replace( "data:image/png;base64,", "", $_POST[ "capture" ] ) ) ) : "";
		$server_id = isset( $_POST[ "server_id" ] ) && !empty( $_POST[ "server_id" ] ) ? sanitize_text_field( $_POST[ "server_id" ] ) : "";
		$remote_id = isset( $_POST[ "remote_id" ] ) && !empty( $_POST[ "remote_id" ] ) ? sanitize_text_field( $_POST[ "remote_id" ] ) : "";

		$response = false;

		if ( !empty( $capture ) && !empty( $server_id ) && !empty( $remote_id ) && is_user_logged_in() ) {
			$user_id = get_current_user_id();

			global $wpdb;

			$user_homeview_captures = $wpdb->prefix ."user_homeview_captures";

			// Get the last capture ID
			$sql_ = "SELECT capture_name FROM $user_homeview_captures WHERE user_id=$user_id ORDER BY ID DESC LIMIT 1";
			$results_ = $wpdb->get_results( $sql_, OBJECT );

			if ( !empty( $results_ ) ) {
				$last_capture_id = intval( explode( "-", $results_[ 0 ]->capture_name )[ 1 ] );
			} else {
				$last_capture_id = 0;
			}

			$next_capture_id = $last_capture_id + 1;

			$capture_name = "capture-". $next_capture_id;

			// Add the new capture in the DB
			$wpdb->insert(
				$user_homeview_captures,
				array(
					"user_id" => $user_id,
					"capture_name" => $capture_name
				)
			);

			// Create the capture
			$capture_path = plugin_dir_path( __FILE__ ) ."captures/". $capture_name .".png";
			file_put_contents( $capture_path, $capture );

			// Send the command to the remote
			$command = "homeview_show_capture_". plugins_url( "/captures/". $capture_name .".png", __FILE__ );
			send_remote_command( $command, $remote_id, $server_id );

			$response = true;
		}

		echo json_encode( $response );
		die( "" );
	}

	function get_captures() {
		$response = false;

		if ( is_user_logged_in() ) {
			$user_id = get_current_user_id();
			$plugin_url = plugins_url( "/captures/", __FILE__ );
			global $wpdb;

			$user_homeview_captures = $wpdb->prefix ."user_homeview_captures";
			$sql_ = "SELECT capture_name FROM $user_homeview_captures WHERE user_id=$user_id ORDER BY ID DESC";
			$results_ = $wpdb->get_results( $sql_, OBJECT );

			$response = array();
			foreach ( $results_ as $result_ ) {
				array_push( $response, $plugin_url . $result_->capture_name .".png" );
			}
		}

		echo json_encode( $response );
		die( "" );
	}
}

$_EX_HV_ = new EX_HV;
?>
