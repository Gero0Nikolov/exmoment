<?php
/*
Plugin Name: Exmoment DB
Description: This plugin will initialize the Exmoment DB.
Version: 1.0
Author: GeroNikolov
Author URI: http://geronikolov.com
License: GPLv2
*/

class EX_MOMENT_DB {
	function __construct() {
		add_action( "init", array( $this, "init_db" ) );
	}

	function __destruct() {}

	function init_db() {
		global $wpdb;

		$user_server_relations = $wpdb->prefix ."user_server_relations";
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$user_server_relations'" ) != $user_server_relations ) {
			$charset_collate = $wpdb->get_charset_collate();
			$sql_ = "
			CREATE TABLE $user_server_relations (
			 	ID INT NOT NULL AUTO_INCREMENT,
				user_id INT,
				server_id VARCHAR(10),
				server_name VARCHAR(15),
				PRIMARY KEY(ID)
			) $charset_collate;
			";
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql_ );
		}

		$user_controllers_relations = $wpdb->prefix ."user_remotes_relations";
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$user_controllers_relations'" ) != $user_controllers_relations ) {
			$charset_collate = $wpdb->get_charset_collate();
			$sql_ = "
			CREATE TABLE $user_controllers_relations (
			 	ID INT NOT NULL AUTO_INCREMENT,
				user_id INT,
				remote_id VARCHAR(10),
				remote_name VARCHAR(15),
				PRIMARY KEY(ID)
			) $charset_collate;
			";
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql_ );
		}

		$controller_server_relations = $wpdb->prefix ."controller_server_relations";
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$controller_server_relations'" ) != $controller_server_relations ) {
			$charset_collate = $wpdb->get_charset_collate();
			$sql_ = "
			CREATE TABLE $controller_server_relations (
			 	ID INT NOT NULL AUTO_INCREMENT,
				controller_id VARCHAR(10),
				server_id VARCHAR(10),
				command VARCHAR(255),
				PRIMARY KEY(ID)
			) $charset_collate;
			";
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql_ );
		}

		$server_controller_relations = $wpdb->prefix ."server_controller_relations";
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$server_controller_relations'" ) != $server_controller_relations ) {
			$charset_collate = $wpdb->get_charset_collate();
			$sql_ = "
			CREATE TABLE $server_controller_relations (
			 	ID INT NOT NULL AUTO_INCREMENT,
				server_id VARCHAR(10),
				controller_id VARCHAR(10),
				command VARCHAR(255),
				PRIMARY KEY(ID)
			) $charset_collate;
			";
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql_ );
		}

		$user_homeview_captures = $wpdb->prefix ."user_homeview_captures";
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$user_homeview_captures'" ) != $user_homeview_captures ) {
			$charset_collate = $wpdb->get_charset_collate();
			$sql_ = "
			CREATE TABLE $user_homeview_captures (
			 	ID INT NOT NULL AUTO_INCREMENT,
				user_id INT,
				capture_name VARCHAR(255),
				capture_date VARCHAR(10),
				PRIMARY KEY(ID)
			) $charset_collate;
			";
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql_ );
		}

		$user_clock_alarms = $wpdb->prefix ."user_clock_alarms";
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$user_clock_alarms'" ) != $user_clock_alarms ) {
			$charset_collate = $wpdb->get_charset_collate();
			$sql_ = "
			CREATE TABLE $user_clock_alarms (
			 	ID INT NOT NULL AUTO_INCREMENT,
				user_id INT,
				hour VARCHAR(2),
				minute VARCHAR(2),
				sound LONGTEXT,
				PRIMARY KEY(ID)
			) $charset_collate;
			";
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql_ );
		}
	}
}

$_EX_MOMENT_DB_ = new EX_MOMENT_DB;
?>
