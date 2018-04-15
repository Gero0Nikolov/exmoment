<?php
/**
 * ExMoment functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package ExMoment
 */

if ( ! function_exists( 'exmoment_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function exmoment_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on ExMoment, use a find and replace
		 * to change 'exmoment' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'exmoment', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary', 'exmoment' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'exmoment_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'exmoment_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function exmoment_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'exmoment_content_width', 640 );
}
add_action( 'after_setup_theme', 'exmoment_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function exmoment_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'exmoment' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'exmoment' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'exmoment_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function exmoment_scripts() {
	wp_enqueue_style( 'dashicons' );
	wp_enqueue_style( 'exmoment-style', get_stylesheet_uri() );

	wp_enqueue_script( 'exmoment-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );

	wp_enqueue_script( 'exmoment-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );

	if ( is_user_logged_in() ) {
		wp_enqueue_style( 'exmoment-logged-css', get_template_directory_uri() . '/logged/logged.css' );
		wp_enqueue_script( 'exmoment-logged-js', get_template_directory_uri() . '/logged/logged.js', array( "jquery" ), '', true );
		wp_enqueue_script( 'exmoment-playroom-js', get_template_directory_uri() . '/logged/play-room.js', array( "jquery" ), '', true );
	}

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'exmoment_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

add_action( 'wp_ajax_add_server', 'add_server' );
add_action( 'wp_ajax_nopriv_add_server', 'add_server' );
function add_server() {
	$server_name = isset( $_POST[ "server_name" ] ) && !empty( $_POST[ "server_name" ] ) ? sanitize_text_field( $_POST[ "server_name" ] ) : "";
	$result = false;

	if ( is_user_logged_in() && !empty( $server_name ) && strlen( $server_name ) < 15 ) {
		$user_id = get_current_user_id();
		$server_id = substr( md5( microtime() ), 0, 10 );

		global $wpdb;

		$user_servers_relations = $wpdb->prefix ."user_server_relations";
		$sql_ = "SELECT ID FROM $user_servers_relations WHERE user_id=$user_id AND server_id='$server_id' LIMIT 1";
		$result_ = $wpdb->get_results( $sql_, OBJECT );

		if ( count( $result_ ) == 0 ) {
			$wpdb->insert(
				$user_servers_relations,
				array(
					"user_id" => $user_id,
					"server_id" => $server_id,
					"server_name" => $server_name
				)
			);
			$result = $server_id;
		}
	}

	echo json_encode( $result );
	die( "" );
}

add_action( 'wp_ajax_add_remote', 'add_remote' );
add_action( 'wp_ajax_nopriv_add_remote', 'add_remote' );
function add_remote() {
	$remote_name = isset( $_POST[ "remote_name" ] ) && !empty( $_POST[ "remote_name" ] ) ? sanitize_text_field( $_POST[ "remote_name" ] ) : "";
	$result = false;

	if ( is_user_logged_in() && !empty( $remote_name ) && strlen( $remote_name ) < 15 ) {
		$user_id = get_current_user_id();
		$remote_id = substr( md5( microtime() ), 0, 10 );

		global $wpdb;

		$user_remotes_relations = $wpdb->prefix ."user_remotes_relations";
		$sql_ = "SELECT ID FROM $user_remotes_relations WHERE user_id=$user_id AND remote_id='$remote_id' LIMIT 1";
		$result_ = $wpdb->get_results( $sql_, OBJECT );

		if ( count( $result_ ) == 0 ) {
			$wpdb->insert(
				$user_remotes_relations,
				array(
					"user_id" => $user_id,
					"remote_id" => $remote_id,
					"remote_name" => $remote_name
				)
			);
			$result = $remote_id;
		}
	}

	echo json_encode( $result );
	die( "" );
}

function get_servers() {
	$result_ = array();

	if ( is_user_logged_in() ) {
		$user_id = get_current_user_id();

		global $wpdb;

		$user_servers_relations = $wpdb->prefix ."user_server_relations";

		$sql_ = "SELECT server_id, server_name FROM $user_servers_relations WHERE user_id=$user_id ORDER BY ID DESC";
		$result_ = $wpdb->get_results( $sql_, OBJECT );
	}

	return $result_;
}

function get_remotes() {
	$result_ = array();

	if ( is_user_logged_in() ) {
		$user_id = get_current_user_id();

		global $wpdb;

		$user_remotes_relations = $wpdb->prefix ."user_remotes_relations";

		$sql_ = "SELECT remote_id, remote_name FROM $user_remotes_relations WHERE user_id=$user_id ORDER BY ID DESC";
		$result_ = $wpdb->get_results( $sql_, OBJECT );
	}

	return $result_;
}

add_action( 'wp_ajax_remove_server', 'remove_server' );
add_action( 'wp_ajax_nopriv_remove_server', 'remove_server' );
function remove_server() {
	$response = false;

	$server_id = isset( $_POST[ "server_id" ] ) && !empty( $_POST[ "server_id" ] ) ? sanitize_text_field( $_POST[ "server_id" ] ) : "";

	if ( is_user_logged_in() && !empty( $server_id ) ) {
		$user_id = get_current_user_id();

		global $wpdb;

		$user_servers_relations = $wpdb->prefix ."user_server_relations";
		$wpdb->delete(
			$user_servers_relations,
			array(
				"user_id" => $user_id,
				"server_id" => $server_id
			)
		);

		$response = $server_id;
	}

	echo json_encode( $response );
	die( "" );
}

add_action( 'wp_ajax_remove_remote', 'remove_remote' );
add_action( 'wp_ajax_nopriv_remove_remote', 'remove_remote' );
function remove_remote() {
	$response = false;

	$remote_id = isset( $_POST[ "remote_id" ] ) && !empty( $_POST[ "remote_id" ] ) ? sanitize_text_field( $_POST[ "remote_id" ] ) : "";

	if ( is_user_logged_in() && !empty( $remote_id ) ) {
		$user_id = get_current_user_id();

		global $wpdb;

		$user_remotes_relations = $wpdb->prefix ."user_remotes_relations";
		$wpdb->delete(
			$user_remotes_relations,
			array(
				"user_id" => $user_id,
				"remote_id" => $remote_id
			)
		);

		$response = $remote_id;
	}

	echo json_encode( $response );
	die( "" );
}

add_action( 'wp_ajax_get_controller_cmds', 'get_controller_cmds' );
add_action( 'wp_ajax_nopriv_get_controller_cmds', 'get_controller_cmds' );
function get_controller_cmds() {
	$server_id = isset( $_POST[ "server_id" ] ) && !empty( $_POST[ "server_id" ] ) ? sanitize_text_field( $_POST[ "server_id" ] ) : "";

	$response = false;

	if ( is_user_logged_in() && !empty( $server_id ) ) {
		global $wpdb;

		$controller_server_relations = $wpdb->prefix ."controller_server_relations";
		$sql_ = "SELECT ID, command FROM $controller_server_relations WHERE server_id='$server_id'";
		$results_ = $wpdb->get_results( $sql_, OBJECT );

		if ( !empty( $results_ ) ) {
			$response = array();
			foreach ( $results_ as $result_ ) {
				array_push( $response, $result_->command );
				$wpdb->delete(
					$controller_server_relations,
					array(
						"ID" => $result_->ID
					)
				);
			}
		}
	}

	echo json_encode( $response );
	die( "" );
}

add_action( 'wp_ajax_get_remote_cmds', 'get_remote_cmds' );
add_action( 'wp_ajax_nopriv_get_remote_cmds', 'get_remote_cmds' );
function get_remote_cmds() {
	$remote_id = isset( $_POST[ "remote_id" ] ) && !empty( $_POST[ "remote_id" ] ) ? sanitize_text_field( $_POST[ "remote_id" ] ) : "";

	$response = false;

	if ( is_user_logged_in() && !empty( $remote_id ) ) {
		global $wpdb;

		$server_controller_relations = $wpdb->prefix ."server_controller_relations";
		$sql_ = "SELECT ID, command FROM $server_controller_relations WHERE controller_id='$remote_id'";
		$results_ = $wpdb->get_results( $sql_, OBJECT );

		if ( !empty( $results_ ) ) {
			$response = array();
			foreach ( $results_ as $result_ ) {
				array_push( $response, $result_->command );
				$wpdb->delete(
					$server_controller_relations,
					array(
						"ID" => $result_->ID
					)
				);
			}
		}
	}

	echo json_encode( $response );
	die( "" );
}

add_action( 'wp_ajax_send_server_command', 'send_server_command' );
add_action( 'wp_ajax_nopriv_send_server_command', 'send_server_command' );
function send_server_command() {
	$command = isset( $_POST[ "command" ] ) && !empty( $_POST[ "command" ] ) ? sanitize_text_field( $_POST[ "command" ] ) : "";
	$remote_id = isset( $_POST[ "remote_id" ] ) && !empty( $_POST[ "remote_id" ] ) ? sanitize_text_field( $_POST[ "remote_id" ] ) : "";
	$server_id = isset( $_POST[ "server_id" ] ) && !empty( $_POST[ "server_id" ] ) ? sanitize_text_field( $_POST[ "server_id" ] ) : "";

	$response = false;

	if ( is_user_logged_in() && !empty( $command ) && !empty( $remote_id ) && !empty( $server_id ) ) {
		global $wpdb;

		$controller_server_relations = $wpdb->prefix ."controller_server_relations";
		$wpdb->insert(
			$controller_server_relations,
			array(
				"controller_id" => $remote_id,
				"server_id" => $server_id,
				"command" => $command
			)
		);

		$response = true;
	}

	echo json_encode( $response );
	die( "" );
}

function send_remote_command( $command, $remote_id, $server_id ) {
	$command = sanitize_text_field( $command );
	$remote_id = sanitize_text_field( $remote_id );
	$server_id = sanitize_text_field( $remote_id );

	$response = false;

	if ( !empty( $command ) && !empty( $remote_id ) && !empty( $server_id ) ) {
		global $wpdb;

		$server_controller_relations = $wpdb->prefix ."server_controller_relations";
		$wpdb->insert(
			$server_controller_relations,
			array(
				"server_id" => $server_id,
				"controller_id" => $remote_id,
				"command" => $command
			)
		);
	}
}
