<?php
/*
Template Name: Pricing Page
*/
get_header();
?>

<section class="pricing">
    <div class="container">
        <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">
                Simple <span class="text-blue-600">Pricing</span>
            </h2>
            <p class="text-gray-600 max-w-xl mx-auto">
                Choose the plan that works best for you. All plans include access to our full range of services.
            </p>

            <div class="flex flex-wrap justify-center gap-4 mt-6">
                <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                    <span class="text-blue-600">🏦</span>
                    <span class="text-sm">Bank Transfer</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                    <span class="text-blue-600">₿</span>
                    <span class="text-sm">Cryptocurrency</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                    <span class="text-blue-600">💳</span>
                    <span class="text-sm">PayPal</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                    <span class="text-blue-600">🌍</span>
                    <span class="text-sm">Wise</span>
                </div>
            </div>
        </div>

        <div class="pricing-grid">
            <div class="pricing-card">
                <h3 class="text-xl font-semibold mb-1">Basic</h3>
                <p class="text-sm text-gray-600 mb-4">Perfect for single submissions</p>
                <div class="flex items-baseline gap-1 mb-6">
                    <span class="text-4xl font-bold">$15</span>
                    <span class="text-gray-600">per report</span>
                </div>
                <ul class="space-y-3 mb-8">
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">1 Plagiarism Report</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">1 AI Detection Report</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">24-hour delivery</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Email support</span>
                    </li>
                </ul>
                <a href="#" class="btn">Get Started</a>
            </div>

            <div class="pricing-card featured">
                <h3 class="text-xl font-semibold mb-1">Student</h3>
                <p class="text-sm text-gray-600 mb-4">Best for regular students</p>
                <div class="flex items-baseline gap-1 mb-6">
                    <span class="text-4xl font-bold">$49</span>
                    <span class="text-gray-600">per month</span>
                </div>
                <ul class="space-y-3 mb-8">
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">10 Reports per month</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Plagiarism + AI Detection</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Basic Proofreading</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Citation Help</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Priority delivery (12h)</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">WhatsApp support</span>
                    </li>
                </ul>
                <a href="#" class="btn">Get Started</a>
            </div>

            <div class="pricing-card">
                <h3 class="text-xl font-semibold mb-1">Premium</h3>
                <p class="text-sm text-gray-600 mb-4">Complete academic support</p>
                <div class="flex items-baseline gap-1 mb-6">
                    <span class="text-4xl font-bold">$99</span>
                    <span class="text-gray-600">per month</span>
                </div>
                <ul class="space-y-3 mb-8">
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Unlimited Reports</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Plagiarism + AI Detection</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Advanced Proofreading</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Full Citation Support</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Assignment Guidance</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">Instant delivery</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="text-blue-600">✓</span>
                        <span class="text-sm text-gray-600">24/7 Priority Support</span>
                    </li>
                </ul>
                <a href="#" class="btn">Get Started</a>
            </div>
        </div>

        <p class="text-center mt-12 text-sm text-gray-600">
            Secure payments. 100% money-back guarantee if not satisfied.
        </p>
    </div>
</section>

<?php get_footer(); ?>