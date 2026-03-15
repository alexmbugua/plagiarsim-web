<?php
/**
 * Kimi Theme Functions - Elementor Compatible
 */

function kimi_enqueue_scripts() {
    // Enqueue the built CSS
    $css_file = glob(get_template_directory() . '/dist/assets/index-*.css');
    if (!empty($css_file)) {
        wp_enqueue_style(
            'kimi-styles',
            get_template_directory_uri() . '/dist/assets/' . basename($css_file[0]),
            array(),
            '1.0.0'
        );
    }

    // Enqueue the built JS
    $js_file = glob(get_template_directory() . '/dist/assets/index-*.js');
    if (!empty($js_file)) {
        wp_enqueue_script(
            'kimi-script',
            get_template_directory_uri() . '/dist/assets/' . basename($js_file[0]),
            array(),
            '1.0.0',
            true
        );

        // Localize script with WordPress data
        wp_localize_script('kimi-script', 'kimiAjax', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('kimi_nonce'),
            'restUrl' => rest_url('kimi/v1/'),
            'isLoggedIn' => is_user_logged_in(),
            'currentUser' => is_user_logged_in() ? array(
                'id' => get_current_user_id(),
                'name' => wp_get_current_user()->display_name,
                'email' => wp_get_current_user()->user_email,
            ) : null,
        ));
    }
}
add_action('wp_enqueue_scripts', 'kimi_enqueue_scripts');

// Add theme support for Elementor
function kimi_add_theme_support() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('elementor');
}
add_action('after_setup_theme', 'kimi_add_theme_support');

// Shortcode for embedding the React app
function kimi_react_app_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '600px',
    ), $atts, 'kimi_app');

    ob_start();
    ?>
    <div id="academic-assist-root" style="width: 100%; height: <?php echo esc_attr($atts['height']); ?>; border: 1px solid #ddd;">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <p>Loading Kimi App...</p>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('kimi_app', 'kimi_react_app_shortcode');