<?php
/*
Template Name: About Page
*/
get_header();
?>

<section class="hero" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0;">
    <div class="container">
        <div class="text-center">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4">About AcademicAssist</h1>
            <p class="text-lg max-w-2xl mx-auto">
                We're dedicated to helping students achieve academic excellence through professional plagiarism detection,
                AI content analysis, and comprehensive academic support services.
            </p>
        </div>
    </div>
</section>

<section style="padding: 80px 0;">
    <div class="container">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 class="text-3xl font-bold mb-6">Our Mission</h2>
                <p class="text-gray-600 mb-4">
                    To empower students worldwide with cutting-edge technology and expert academic support,
                    ensuring originality and quality in their work.
                </p>
                <p class="text-gray-600 mb-4">
                    We leverage Turnitin's advanced detection systems to provide accurate plagiarism and AI content reports,
                    helping students maintain academic integrity.
                </p>
                <p class="text-gray-600">
                    Our team of academic experts provides proofreading, citation assistance, and assignment guidance
                    to help you excel in your studies.
                </p>
            </div>
            <div>
                <img src="<?php echo get_template_directory_uri(); ?>/images/about-image.png" alt="About Us" class="w-full rounded-lg shadow-lg">
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>