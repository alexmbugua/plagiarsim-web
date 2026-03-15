<?php
/**
 * Kimi Pages Theme Functions
 */

function kimi_pages_enqueue_scripts() {
    wp_enqueue_style('kimi-pages-style', get_stylesheet_uri(), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'kimi_pages_enqueue_scripts');

function kimi_pages_theme_support() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('elementor');
}
add_action('after_setup_theme', 'kimi_pages_theme_support');