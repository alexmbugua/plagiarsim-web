<?php
/**
 * Template Name: Turnitin Check
 * Description: Full-width template for Turnitin Check application
 */

get_header();
?>

<style>
/* Reset WordPress theme styles for this page */
.turnitin-check-page {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
}

.turnitin-check-page .entry-header,
.turnitin-check-page .entry-footer,
.turnitin-check-page .post-navigation,
.turnitin-check-page .comments-area {
    display: none;
}

.turnitin-check-page .entry-content {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
}

/* Loading spinner */
.turnitin-check-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 20px;
}

.turnitin-check-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e9e9e9;
    border-top-color: #3557e7;
    border-radius: 50%;
    animation: turnitin-spin 1s linear infinite;
}

@keyframes turnitin-spin {
    to {
        transform: rotate(360deg);
    }
}

.turnitin-check-loading p {
    font-family: 'Inter', sans-serif;
    color: #6b7280;
    font-size: 16px;
}
</style>

<div class="turnitin-check-page">
    <div id="turnitin-check-root">
        <div class="turnitin-check-loading">
            <div class="turnitin-check-spinner"></div>
            <p>Loading Turnitin Check...</p>
        </div>
    </div>
</div>

<?php
// Enqueue the React app scripts
$plugin_url = plugin_dir_url(__FILE__);
$dist_path = $plugin_url . 'dist/';

// Find the built files
$css_files = glob(__DIR__ . '/dist/assets/*.css');
$js_files = glob(__DIR__ . '/dist/assets/*.js');

if (!empty($css_files)) {
    $css_file = basename($css_files[0]);
    wp_enqueue_style('turnitin-check', $dist_path . 'assets/' . $css_file, array(), '1.0.0');
}

if (!empty($js_files)) {
    $js_file = basename($js_files[0]);
    wp_enqueue_script('turnitin-check', $dist_path . 'assets/' . $js_file, array(), '1.0.0', true);
    
    // Pass AJAX URL to JavaScript
    wp_localize_script('turnitin-check-script', 'turnitinCheckAjax', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('turnitin_check_nonce')
    ));
}
?>

<?php get_footer(); ?>
