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

		add_action( 'wp_ajax_create_new_alarm', array( $this, 'create_new_alarm' ) );
		add_action( 'wp_ajax_nopriv_create_new_alarm', array( $this, 'create_new_alarm' ) );

		add_action( 'wp_ajax_get_alarms', array( $this, 'get_alarms' ) );
		add_action( 'wp_ajax_nopriv_get_alarms', array( $this, 'get_alarms' ) );

		add_action( 'wp_ajax_remove_alarm', array( $this, 'remove_alarm' ) );
		add_action( 'wp_ajax_nopriv_remove_alarm', array( $this, 'remove_alarm' ) );
	}

	function __destruct() {}

	function ex_clock_js() {
		wp_enqueue_script( 'ex-clock-js', plugins_url( '/assets/ex-clk.js' , __FILE__ ), array('jquery'), '1.0', true );
	}

	function ex_clock_css() {
		wp_enqueue_style( 'ex-clock-css', plugins_url( '/assets/ex-clk.css', __FILE__ ), array(), '1.0', 'screen' );
	}

	function create_new_alarm() {
		$hour = isset( $_POST[ "hour" ] ) && !empty( $_POST[ "hour" ] ) ? intval( $_POST[ "hour" ] ) : 0;
		$minutes = isset( $_POST[ "minutes" ] ) && !empty( $_POST[ "minutes" ] ) ? intval( $_POST[ "minutes" ] ) : 0;
		$sound_url = isset( $_POST[ "sound_url" ] ) && !empty( $_POST[ "sound_url" ] ) ? sanitize_text_field( $_POST[ "sound_url" ] ) : "";

		$response = false;

		if ( $hour > 0 && is_user_logged_in() ) {
			$user_id = get_current_user_id();

			global $wpdb;

			$user_clock_alarms = $wpdb->prefix ."user_clock_alarms";
			$wpdb->insert(
				$user_clock_alarms,
				array(
					"user_id" => $user_id,
					"hour" => $hour,
					"minute" => $minutes,
					"sound" => $sound_url
				)
			);

			$response = true;
		}

		echo json_encode( $response );
		die( "" );
	}

	function get_alarms() {
		$response = false;

		if ( is_user_logged_in() ) {
			$user_id = get_current_user_id();

			global $wpdb;

			$user_clock_alarms = $wpdb->prefix ."user_clock_alarms";

			$sql_ = "SELECT ID, user_id, hour, minute, sound FROM $user_clock_alarms WHERE user_id=$user_id ORDER BY ID DESC";
			$results_ = $wpdb->get_results( $sql_, OBJECT );

			$response = array();
			if ( count( $results_ ) > 0 ) {
				foreach ( $results_ as $result_ ) {
					$alarm_ = new stdClass;
					$alarm_->id = $result_->ID;
					$alarm_->creator_id = $result_->user_id;
					$alarm_->hour = $result_->hour < 10 ? "0". $result_->hour : $result_->hour;
					$alarm_->minutes = $result_->minute < 10 ? "0". $result_->minute : $result_->minute;

					if ( isset( $result_->sound ) && !empty( $result_->sound ) ) {
						$parseUrl = parse_url( $result_->sound );
						if ( $parseUrl['host'] == 'www.youtube.com' || $parseUrl['host'] == 'm.youtube.com' || $parseUrl['host'] == 'youtu.be' ) {
							$query = $parseUrl['query'];
							$queryParse = explode("=", $query);

							if ($parseUrl['host'] == 'youtu.be') {
								$queryParse = $parseUrl['path'];
								$src = "https://www.youtube.com/embed/$queryParse?autoplay=1";
							}
							else
							if ($parseUrl['host'] == 'm.youtube.com') {
								$src = "https://www.youtube.com/embed/$queryParse[1]?autoplay=1";
							} else {
								$src = "https://www.youtube.com/embed/$queryParse[1]?autoplay=1";
							}
						}
					} else { $src = "https://www.youtube.com/embed/HAIO6vr6eso?autoplay=1"; }

					$alarm_->src = $src;
					array_push( $response, $alarm_ );
				}
			}
		}

		echo json_encode( $response );
		die( "" );
	}

	function remove_alarm() {
		$alarm_id = isset( $_POST[ "alarm_id" ] ) && !empty( $_POST[ "alarm_id" ] ) ? intval( $_POST[ "alarm_id" ] ) : 0;

		$response = false;

		if ( is_user_logged_in() && $alarm_id > 0 ) {
			$user_id = get_current_user_id();

			global $wpdb;

			$user_clock_alarms = $wpdb->prefix ."user_clock_alarms";

			$wpdb->delete(
				$user_clock_alarms,
				array(
					"ID" => $alarm_id,
					"user_id" => $user_id,
				)
			);

			$response = $alarm_id;
		}

		echo json_encode( $response );
		die( "" );
	}
}

$_CLOCK_ = new CLOCK;
?>
