<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <header>
        <div class="container">
            <nav>
                <ul>
                    <li><a href="<?php echo home_url(); ?>">Home</a></li>
                    <li><a href="<?php echo get_permalink(get_page_by_path('about')); ?>">About</a></li>
                    <li><a href="<?php echo get_permalink(get_page_by_path('features')); ?>">Features</a></li>
                    <li><a href="<?php echo get_permalink(get_page_by_path('pricing')); ?>">Pricing</a></li>
                    <li><a href="<?php echo get_permalink(get_page_by_path('contact')); ?>">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; endif; ?>
    </main>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> AcademicAssist. All rights reserved.</p>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>