<?php
/*
Template Name: Home Page
*/
get_header();
?>

<section class="hero">
    <div class="container">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                    <span class="text-blue-600 font-medium">Powered by Turnitin Technology</span>
                </div>

                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    Get Professional <span class="text-blue-600">Academic</span> <span class="text-blue-600">Reports</span> & Services
                </h1>

                <p class="text-lg max-w-xl leading-relaxed">
                    We help students access professional plagiarism and AI detection reports powered by Turnitin.
                    Plus proofreading, citation help, and assignment assistance to boost your academic success.
                </p>

                <div class="flex flex-wrap gap-4">
                    <a href="#" class="btn">Get Started</a>
                    <a href="#services" class="btn">Our Services</a>
                </div>

                <div class="flex flex-wrap gap-6 pt-4">
                    <div class="flex items-center gap-2">
                        <span class="text-blue-600">✓</span>
                        <span>Plagiarism Reports</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-blue-600">✓</span>
                        <span>AI Detection</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-blue-600">✓</span>
                        <span>Proofreading</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-blue-600">✓</span>
                        <span>Citation Help</span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-600">50K+</div>
                        <div class="text-sm text-gray-600">Students Helped</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-600">100K+</div>
                        <div class="text-sm text-gray-600">Reports Generated</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-600">99%</div>
                        <div class="text-sm text-gray-600">Satisfaction Rate</div>
                    </div>
                </div>
            </div>

            <div class="relative flex justify-center lg:justify-end">
                <div class="relative w-full max-w-[500px]">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/hero-hand.png" alt="Academic Success" class="w-full h-auto drop-shadow-2xl" />

                    <div class="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-4">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span class="text-green-600">✓</span>
                            </div>
                            <span class="text-sm font-medium">Plagiarism: 5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>