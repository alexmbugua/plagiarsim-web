<?php
/*
Template Name: Contact Page
*/
get_header();
?>

<section class="hero" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0;">
    <div class="container">
        <div class="text-center">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
            <p class="text-lg max-w-2xl mx-auto">
                Get in touch with our academic support team. We're here to help you succeed.
            </p>
        </div>
    </div>
</section>

<section style="padding: 80px 0;">
    <div class="container">
        <div class="grid md:grid-cols-2 gap-12">
            <div>
                <h2 class="text-3xl font-bold mb-6">Get In Touch</h2>
                <div class="space-y-6">
                    <div class="flex items-start gap-4">
                        <span class="text-blue-600 text-2xl">📧</span>
                        <div>
                            <h3 class="font-semibold">Email Support</h3>
                            <p class="text-gray-600">support@academicassist.com</p>
                            <p class="text-sm text-gray-500">Response within 24 hours</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <span class="text-blue-600 text-2xl">💬</span>
                        <div>
                            <h3 class="font-semibold">WhatsApp</h3>
                            <p class="text-gray-600">+1 (555) 123-4567</p>
                            <p class="text-sm text-gray-500">Available 24/7 for urgent queries</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <span class="text-blue-600 text-2xl">⏰</span>
                        <div>
                            <h3 class="font-semibold">Business Hours</h3>
                            <p class="text-gray-600">Monday - Friday: 9AM - 6PM EST</p>
                            <p class="text-sm text-gray-500">Emergency support available 24/7</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <form class="bg-white p-8 rounded-lg shadow-lg">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Your Name">
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="your@email.com">
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Subject</label>
                        <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="How can we help?">
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Message</label>
                        <textarea rows="5" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Tell us about your academic needs..."></textarea>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>