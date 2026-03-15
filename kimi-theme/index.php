<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php if (function_exists('elementor_theme_do_location') && elementor_theme_do_location('header')) : ?>
        <?php elementor_theme_do_location('header'); ?>
    <?php else : ?>
        <header>
            <div class="container">
                <h1><?php bloginfo('name'); ?></h1>
            </div>
        </header>
    <?php endif; ?>

    <main id="main">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article>
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <p>No content found.</p>
        <?php endif; ?>
    </main>

    <?php if (function_exists('elementor_theme_do_location') && elementor_theme_do_location('footer')) : ?>
        <?php elementor_theme_do_location('footer'); ?>
    <?php else : ?>
        <footer>
            <div class="container">
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?></p>
            </div>
        </footer>
    <?php endif; ?>

    <?php wp_footer(); ?>
</body>
</html>