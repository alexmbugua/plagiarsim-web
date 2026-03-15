<?php
/**
 * Plugin Name: AcademicAssist
 * Plugin URI: https://academicassist.com
 * Description: Student academic support platform - Plagiarism reports, AI detection, proofreading, citation help, and assignment assistance
 * Version: 1.0.0
 * Author: AcademicAssist
 * Author URI: https://academicassist.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: academicassist
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ACADEMIC_ASSIST_VERSION', '1.0.0');
define('ACADEMIC_ASSIST_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ACADEMIC_ASSIST_PLUGIN_URL', plugin_dir_url(__FILE__));

class Academic_Assist_Plugin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('academic_assist', array($this, 'render_app'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_academic_assist_auth', array($this, 'handle_auth'));
        add_action('wp_ajax_nopriv_academic_assist_auth', array($this, 'handle_auth'));
        add_action('wp_head', array($this, 'add_styles'));
        
        // REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Ensure the plugin starts with a clean state for new installs.
        if (!get_option('academic_assist_reset_done')) {
            $this->reset_all_user_data();
            update_option('academic_assist_reset_done', 1);
        }
    }

    /**
     * Ensure default user meta values exist.
     */
    private function ensure_user_defaults($user_id) {
        if (!get_user_meta($user_id, 'academic_assist_wallet', true) && '0' !== get_user_meta($user_id, 'academic_assist_wallet', true)) {
            update_user_meta($user_id, 'academic_assist_wallet', 0);
        }
        if (!get_user_meta($user_id, 'academic_assist_slots', true) && '0' !== get_user_meta($user_id, 'academic_assist_slots', true)) {
            update_user_meta($user_id, 'academic_assist_slots', 0);
        }
        if (!get_user_meta($user_id, 'academic_assist_orders', true) && !is_array(get_user_meta($user_id, 'academic_assist_orders', true))) {
            update_user_meta($user_id, 'academic_assist_orders', array());
        }
        if (!get_user_meta($user_id, 'academic_assist_transactions', true) && !is_array(get_user_meta($user_id, 'academic_assist_transactions', true))) {
            update_user_meta($user_id, 'academic_assist_transactions', array());
        }
    }

    private function get_user_wallet($user_id) {
        $this->ensure_user_defaults($user_id);
        return (float) get_user_meta($user_id, 'academic_assist_wallet', true);
    }

    private function set_user_wallet($user_id, $amount) {
        update_user_meta($user_id, 'academic_assist_wallet', round((float) $amount, 2));
    }

    private function get_user_slots($user_id) {
        $this->ensure_user_defaults($user_id);
        return intval(get_user_meta($user_id, 'academic_assist_slots', true));
    }

    private function set_user_slots($user_id, $slots) {
        update_user_meta($user_id, 'academic_assist_slots', max(0, intval($slots)));
    }

    private function get_user_orders($user_id) {
        $this->ensure_user_defaults($user_id);
        $orders = get_user_meta($user_id, 'academic_assist_orders', true);
        return is_array($orders) ? $orders : array();
    }

    private function set_user_orders($user_id, $orders) {
        update_user_meta($user_id, 'academic_assist_orders', $orders);
    }

    private function add_user_order($user_id, $order) {
        $orders = $this->get_user_orders($user_id);
        $orders[] = $order;
        $this->set_user_orders($user_id, $orders);
        return $order;
    }

    private function find_user_order($user_id, $order_id) {
        $orders = $this->get_user_orders($user_id);
        foreach ($orders as $order) {
            if (isset($order['id']) && $order['id'] === $order_id) {
                return $order;
            }
        }
        return null;
    }

    private function update_user_order($user_id, $order_id, $updates) {
        $orders = $this->get_user_orders($user_id);
        $updated = false;
        foreach ($orders as $index => $order) {
            if (isset($order['id']) && $order['id'] === $order_id) {
                $orders[$index] = array_merge($order, $updates);
                $updated = true;
                break;
            }
        }
        if ($updated) {
            $this->set_user_orders($user_id, $orders);
        }
        return $updated ? $orders[$index] : null;
    }

    private function delete_user_order($user_id, $order_id) {
        $orders = $this->get_user_orders($user_id);
        $filtered = array_filter($orders, function($order) use ($order_id) {
            return !(isset($order['id']) && $order['id'] === $order_id);
        });
        if (count($filtered) !== count($orders)) {
            $this->set_user_orders($user_id, array_values($filtered));
            return true;
        }
        return false;
    }

    private function add_transaction($user_id, $amount, $type = 'topup', $source = '') {
        $this->ensure_user_defaults($user_id);
        $transactions = get_user_meta($user_id, 'academic_assist_transactions', true);
        if (!is_array($transactions)) {
            $transactions = array();
        }
        $transactions[] = array(
            'id' => uniqid('txn_', true),
            'type' => $type,
            'amount' => round((float) $amount, 2),
            'source' => sanitize_text_field($source),
            'createdAt' => date('c'),
        );
        update_user_meta($user_id, 'academic_assist_transactions', $transactions);
        return $transactions;
    }

    private function get_transactions($user_id) {
        $this->ensure_user_defaults($user_id);
        $transactions = get_user_meta($user_id, 'academic_assist_transactions', true);
        return is_array($transactions) ? $transactions : array();
    }

    public static function on_activation() {
        $instance = self::get_instance();
        $instance->reset_all_user_data();
    }

    public function reset_all_user_data() {
        // Reset wallet, slots, orders, and transactions for all users.
        $users = get_users(array('fields' => 'ID'));
        foreach ($users as $user_id) {
            update_user_meta($user_id, 'academic_assist_wallet', 0);
            update_user_meta($user_id, 'academic_assist_slots', 0);
            update_user_meta($user_id, 'academic_assist_orders', array());
            update_user_meta($user_id, 'academic_assist_transactions', array());
        }
    }

    public function add_styles() {
        echo '<style>
        .academic-assist-container {
            min-height: 100vh;
            position: relative;
        }
        .academic-assist-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 20px;
        }
        .academic-assist-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e9e9e9;
            border-top-color: #3557e7;
            border-radius: 50%;
            animation: academic-spin 1s linear infinite;
        }
        @keyframes academic-spin {
            to { transform: rotate(360deg); }
        }
        .academic-assist-loading p {
            font-family: "Inter", sans-serif;
            color: #6b7280;
            font-size: 16px;
        }
        #academic-assist-root {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
        }
        </style>';
    }
    
    public function enqueue_scripts() {
        global $post;
        
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'academic_assist')) {
            error_log('AcademicAssist: Shortcode found, enqueuing scripts');
            
            $asset_dir = ACADEMIC_ASSIST_PLUGIN_URL . 'dist/';
            
            $css_file = $this->get_asset_file('assets', 'css');
            $js_file = $this->get_asset_file('assets', 'js');
            
            error_log('AcademicAssist: CSS file: ' . $css_file);
            error_log('AcademicAssist: JS file: ' . $js_file);
            
            if ($css_file) {
                wp_enqueue_style(
                    'academic-assist-styles',
                    $asset_dir . $css_file,
                    array(),
                    ACADEMIC_ASSIST_VERSION
                );
            }
            
            if ($js_file) {
                wp_enqueue_script(
                    'academic-assist-script',
                    $asset_dir . $js_file,
                    array(),
                    ACADEMIC_ASSIST_VERSION,
                    true
                );
                
                wp_localize_script('academic-assist-script', 'academicAssistAjax', array(
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('academic_assist_nonce'),
                    'restUrl' => rest_url('academic-assist/v1/'),
                    'isLoggedIn' => is_user_logged_in(),
                    'isAdmin' => current_user_can('manage_options'),
                    'currentUser' => is_user_logged_in() ? array(
                        'id' => get_current_user_id(),
                        'name' => wp_get_current_user()->display_name,
                        'email' => wp_get_current_user()->user_email,
                        'roles' => wp_get_current_user()->roles,
                    ) : null,
                ));
            }
        } else {
            error_log('AcademicAssist: Shortcode not found or not on post page');
        }
    }
    
    private function get_asset_file($folder, $extension) {
        $dist_path = ACADEMIC_ASSIST_PLUGIN_DIR . 'dist/' . $folder . '/';
        
        if (!is_dir($dist_path)) {
            return false;
        }
        
        $files = glob($dist_path . 'index-*.' . $extension);
        
        if (!empty($files)) {
            return $folder . '/' . basename($files[0]);
        }
        
        return false;
    }
    
    public function render_app($atts) {
        $atts = shortcode_atts(array(
            'view' => 'full',
        ), $atts, 'academic_assist');
        
        // Add full-screen styles to hide WordPress elements
        $full_screen_style = '';
        if ($atts['view'] === 'full') {
            $full_screen_style = '
            <style>
            body { margin: 0; padding: 0; }
            #wpadminbar, #wpadminbar * { display: none !important; }
            .admin-bar body { margin-top: 0 !important; }
            #academic-assist-root { 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100vw; 
                height: 100vh; 
                z-index: 9999; 
                overflow: auto;
            }
            </style>';
        }
        
        error_log('AcademicAssist: Shortcode rendered');
        
        ob_start();
        echo $full_screen_style;
        ?>
        <div id="academic-assist-root" class="academic-assist-container" data-view="<?php echo esc_attr($atts['view']); ?>">
            <div class="academic-assist-loading">
                <div class="academic-assist-spinner"></div>
                <p>Loading AcademicAssist...</p>
            </div>
        </div>
        <script>
        console.log('AcademicAssist: Shortcode script loaded');
        // Test if container exists
        setTimeout(function() {
            var container = document.getElementById('academic-assist-root');
            console.log('AcademicAssist: Container check', container);
            if (container) {
                console.log('AcademicAssist: Container found');
            } else {
                console.error('AcademicAssist: Container not found');
            }
        }, 1000);
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'AcademicAssist',
            'AcademicAssist',
            'manage_options',
            'academic-assist',
            array($this, 'admin_page'),
            'dashicons-welcome-learn-more',
            30
        );
        
        add_submenu_page(
            'academic-assist',
            'Settings',
            'Settings',
            'manage_options',
            'academic-assist-settings',
            array($this, 'settings_page')
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>AcademicAssist</h1>
            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>How to Use</h2>
                <p>Add the shortcode <code>[academic_assist]</code> to any page or post to display the application.</p>
                
                <h3>Features:</h3>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li>Plagiarism Reports (Powered by Turnitin)</li>
                    <li>AI Detection Reports</li>
                    <li>Professional Proofreading</li>
                    <li>Citation Help (APA, MLA, Chicago, Harvard)</li>
                    <li>Assignment Assistance</li>
                    <li>User registration and login</li>
                    <li>Wallet system with multiple payment options</li>
                </ul>
                
                <h3>Payment Methods Supported:</h3>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li>Bank Transfer</li>
                    <li>Cryptocurrency (BTC, ETH, USDT)</li>
                    <li>PayPal</li>
                    <li>Wise</li>
                </ul>
            </div>
        </div>
        <?php
    }
    
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1>AcademicAssist Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('academic_assist_options');
                do_settings_sections('academic-assist-settings');
                ?>

                <h2>API & Integration</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Turnitin API URL</th>
                        <td>
                            <input type="url" name="academic_assist_turnitin_api_url" 
                                   value="<?php echo esc_attr(get_option('academic_assist_turnitin_api_url')); ?>" 
                                   class="regular-text">
                            <p class="description">Base URL used for Turnitin API requests.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Turnitin API Key</th>
                        <td>
                            <input type="text" name="academic_assist_turnitin_api_key" 
                                   value="<?php echo esc_attr(get_option('academic_assist_turnitin_api_key')); ?>" 
                                   class="regular-text">
                            <p class="description">API key for Turnitin or plagiarism provider.</p>
                        </td>
                    </tr>
                </table>

                <h2>Payment Settings</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">PayPal Client ID</th>
                        <td>
                            <input type="text" name="academic_assist_paypal_client_id" 
                                   value="<?php echo esc_attr(get_option('academic_assist_paypal_client_id')); ?>" 
                                   class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Wise Business Account</th>
                        <td>
                            <input type="text" name="academic_assist_wise_account" 
                                   value="<?php echo esc_attr(get_option('academic_assist_wise_account')); ?>" 
                                   class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Crypto Wallet Address</th>
                        <td>
                            <input type="text" name="academic_assist_crypto_wallet" 
                                   value="<?php echo esc_attr(get_option('academic_assist_crypto_wallet')); ?>" 
                                   class="regular-text">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Payment Webhook URL</th>
                        <td>
                            <input type="url" name="academic_assist_payment_webhook" 
                                   value="<?php echo esc_attr(get_option('academic_assist_payment_webhook')); ?>" 
                                   class="regular-text">
                            <p class="description">Optional webhook endpoint for payment provider callbacks.</p>
                        </td>
                    </tr>
                </table>

                <h2>Notifications</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">Telegram Bot Token</th>
                        <td>
                            <input type="text" name="academic_assist_telegram_token" 
                                   value="<?php echo esc_attr(get_option('academic_assist_telegram_token')); ?>" 
                                   class="regular-text">
                            <p class="description">Enter your Telegram bot token for order notifications.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">WhatsApp Number</th>
                        <td>
                            <input type="text" name="academic_assist_whatsapp" 
                                   value="<?php echo esc_attr(get_option('academic_assist_whatsapp')); ?>" 
                                   class="regular-text">
                            <p class="description">WhatsApp number for customer support notifications.</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Support Email</th>
                        <td>
                            <input type="email" name="academic_assist_email" 
                                   value="<?php echo esc_attr(get_option('academic_assist_email', get_option('admin_email'))); ?>" 
                                   class="regular-text">
                        </td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
    
    public function handle_auth() {
        check_ajax_referer('academic_assist_nonce', 'nonce');
        
        $action = isset($_POST['auth_action']) ? sanitize_text_field($_POST['auth_action']) : '';
        
        if ($action === 'login') {
            $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';
            
            $user = wp_authenticate($email, $password);
            
            if (is_wp_error($user)) {
                wp_send_json_error(array('message' => $user->get_error_message()));
            } else {
                wp_set_current_user($user->ID);
                wp_set_auth_cookie($user->ID);
                // Ensure user meta has defaults.
                $this->ensure_user_defaults($user->ID);
                wp_send_json_success(array(
                    'user' => array(
                        'id' => $user->ID,
                        'email' => $user->user_email,
                        'name' => $user->display_name,
                        'isAdmin' => user_can($user, 'manage_options'),
                    )
                ));
            }
        } elseif ($action === 'register') {
            $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
            $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';
            
            if (email_exists($email)) {
                wp_send_json_error(array('message' => 'Email already exists'));
            }
            
            $user_id = wp_create_user($email, $password, $email);
            
            if (is_wp_error($user_id)) {
                wp_send_json_error(array('message' => $user_id->get_error_message()));
            } else {
                wp_update_user(array(
                    'ID' => $user_id,
                    'display_name' => $name,
                ));

                // Initialize user data
                $this->ensure_user_defaults($user_id);
                wp_set_current_user($user_id);
                wp_set_auth_cookie($user_id);

                wp_send_json_success(array(
                    'user' => array(
                        'id' => $user_id,
                        'email' => $email,
                        'name' => $name,
                        'isAdmin' => user_can($user_id, 'manage_options'),
                    )
                ));
            }
        }
        
        wp_send_json_error(array('message' => 'Invalid action'));
    }
    
    public function register_rest_routes() {
        register_rest_route('academic-assist/v1', '/me', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_current_user_info'),
            'permission_callback' => array($this, 'check_user_permission'),
        ));

        register_rest_route('academic-assist/v1', '/wallet', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_wallet_balance'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'topup_wallet'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
        ));

        register_rest_route('academic-assist/v1', '/slots', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_slots'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'add_slots'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
        ));

        register_rest_route('academic-assist/v1', '/orders', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_user_documents'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'create_order'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
        ));

        register_rest_route('academic-assist/v1', '/orders/(?P<id>[A-Za-z0-9_-]+)', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_order'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
            array(
                'methods' => 'PUT',
                'callback' => array($this, 'update_order'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
            array(
                'methods' => 'DELETE',
                'callback' => array($this, 'delete_order'),
                'permission_callback' => array($this, 'check_user_permission'),
            ),
        ));

        // Admin routes
        register_rest_route('academic-assist/v1', '/admin/stats', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_admin_stats'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));

        register_rest_route('academic-assist/v1', '/admin/users', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_admin_users'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));

        register_rest_route('academic-assist/v1', '/admin/users/(?P<id>\d+)/wallet', array(
            'methods' => 'POST',
            'callback' => array($this, 'admin_add_wallet'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));

        register_rest_route('academic-assist/v1', '/admin/users/(?P<id>\d+)/slots', array(
            'methods' => 'POST',
            'callback' => array($this, 'admin_add_slots'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));

        register_rest_route('academic-assist/v1', '/admin/orders', array(
            'methods' => 'GET',
            'callback' => array($this, 'admin_get_orders'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));
    }

    public function check_user_permission() {
        return is_user_logged_in();
    }
    
    public function get_current_user_info() {
        $user_id = get_current_user_id();
        $user = wp_get_current_user();

        return new WP_REST_Response(array(
            'id' => $user_id,
            'name' => $user->display_name,
            'email' => $user->user_email,
            'isAdmin' => current_user_can('manage_options'),
            'wallet' => $this->get_user_wallet($user_id),
            'slots' => $this->get_user_slots($user_id),
        ), 200);
    }

    public function get_user_documents() {
        $user_id = get_current_user_id();
        $documents = $this->get_user_orders($user_id);
        return new WP_REST_Response(array_values($documents), 200);
    }

    public function create_order($request) {
        $user_id = get_current_user_id();
        $slots = $this->get_user_slots($user_id);
        if ($slots <= 0) {
            return new WP_Error('no_slots', 'No upload slots available. Please add funds to purchase slots.', array('status' => 400));
        }

        $body = $request->get_json_params();
        $service = isset($body['service']) ? sanitize_text_field($body['service']) : 'service';
        $price = isset($body['price']) ? floatval($body['price']) : 0;
        $filename = isset($body['filename']) ? sanitize_text_field($body['filename']) : 'document.pdf';
        $fileSize = isset($body['fileSize']) ? intval($body['fileSize']) : 0;

        $order = array(
            'id' => uniqid('order_', true),
            'service' => $service,
            'price' => $price,
            'filename' => $filename,
            'originalName' => $filename,
            'fileSize' => $fileSize,
            'status' => 'processing',
            'uploadedAt' => date('c'),
            'aiScore' => null,
            'plagiarismScore' => null,
        );

        $this->add_user_order($user_id, $order);
        $this->set_user_slots($user_id, $slots - 1);

        return new WP_REST_Response(array(
            'order' => $order,
            'slotsRemaining' => $this->get_user_slots($user_id),
        ), 201);
    }

    public function get_wallet_balance() {
        $user_id = get_current_user_id();
        $balance = $this->get_user_wallet($user_id);
        $slots = $this->get_user_slots($user_id);

        return new WP_REST_Response(array(
            'balance' => (float) $balance,
            'slots' => $slots,
            'currency' => 'USD'
        ), 200);
    }

    public function topup_wallet($request) {
        $user_id = get_current_user_id();
        $body = $request->get_json_params();
        $amount = isset($body['amount']) ? floatval($body['amount']) : 0;
        $method = isset($body['method']) ? sanitize_text_field($body['method']) : 'manual';

        if ($amount <= 0) {
            return new WP_Error('invalid_amount', 'Amount must be greater than zero.', array('status' => 400));
        }

        $current = $this->get_user_wallet($user_id);
        $newBalance = $current + $amount;
        $this->set_user_wallet($user_id, $newBalance);
        $this->add_transaction($user_id, $amount, 'topup', $method);

        // Convert funds to slots: 1 slot per $10
        $slotsToAdd = floor($amount / 10);
        if ($slotsToAdd > 0) {
            $currentSlots = $this->get_user_slots($user_id);
            $this->set_user_slots($user_id, $currentSlots + $slotsToAdd);
        }

        return new WP_REST_Response(array(
            'balance' => $newBalance,
            'slots' => $this->get_user_slots($user_id),
            'addedSlots' => isset($slotsToAdd) ? $slotsToAdd : 0,
            'currency' => 'USD'
        ), 200);
    }

    public function get_slots() {
        $user_id = get_current_user_id();
        return new WP_REST_Response(array(
            'slots' => $this->get_user_slots($user_id),
        ), 200);
    }

    public function check_admin_permission() {
        return current_user_can('manage_options');
    }

    public function get_order($request) {
        $order_id = $request->get_param('id');
        $user_id = get_current_user_id();
        $order = $this->find_user_order($user_id, $order_id);

        if (!$order) {
            return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
        }
        return new WP_REST_Response($order, 200);
    }

    public function update_order($request) {
        $order_id = $request->get_param('id');
        $body = $request->get_json_params();
        $user_id = get_current_user_id();
        $order = $this->find_user_order($user_id, $order_id);

        if (!$order) {
            // allow admins to update any order
            if (current_user_can('manage_options')) {
                // find order across all users
                $users = get_users(array('fields' => 'ID'));
                foreach ($users as $uid) {
                    $ord = $this->find_user_order($uid, $order_id);
                    if ($ord) {
                        $user_id = $uid;
                        $order = $ord;
                        break;
                    }
                }
            }
        }

        if (!$order) {
            return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
        }

        $updates = array();
        if (isset($body['status'])) {
            $updates['status'] = sanitize_text_field($body['status']);
            if ($updates['status'] === 'completed' && empty($order['completedAt'])) {
                $updates['completedAt'] = date('c');
            }
        }
        if (isset($body['aiScore'])) {
            $updates['aiScore'] = floatval($body['aiScore']);
        }
        if (isset($body['plagiarismScore'])) {
            $updates['plagiarismScore'] = floatval($body['plagiarismScore']);
        }

        $updatedOrder = $this->update_user_order($user_id, $order_id, $updates);
        if (!$updatedOrder) {
            return new WP_Error('update_failed', 'Unable to update order', array('status' => 500));
        }

        return new WP_REST_Response($updatedOrder, 200);
    }

    public function delete_order($request) {
        $order_id = $request->get_param('id');
        $user_id = get_current_user_id();
        $order = $this->find_user_order($user_id, $order_id);

        if (!$order && !current_user_can('manage_options')) {
            return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
        }

        if (!$order) {
            // admin delete
            $users = get_users(array('fields' => 'ID'));
            foreach ($users as $uid) {
                if ($this->delete_user_order($uid, $order_id)) {
                    return new WP_REST_Response(array('success' => true), 200);
                }
            }
            return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
        }

        $deleted = $this->delete_user_order($user_id, $order_id);
        return new WP_REST_Response(array('success' => (bool) $deleted), 200);
    }

    public function get_admin_stats() {
        $users = get_users(array('fields' => 'ID'));
        $totalUsers = count($users);
        $totalOrders = 0;
        $totalRevenue = 0;
        $pendingOrders = 0;

        foreach ($users as $user_id) {
            $orders = $this->get_user_orders($user_id);
            $totalOrders += count($orders);
            foreach ($orders as $order) {
                if (isset($order['status']) && $order['status'] === 'pending') {
                    $pendingOrders++;
                }
            }

            $transactions = $this->get_transactions($user_id);
            foreach ($transactions as $txn) {
                if (isset($txn['type']) && $txn['type'] === 'topup') {
                    $totalRevenue += floatval($txn['amount']);
                }
            }
        }

        return new WP_REST_Response(array(
            'totalUsers' => $totalUsers,
            'totalOrders' => $totalOrders,
            'totalRevenue' => round($totalRevenue, 2),
            'pendingOrders' => $pendingOrders,
        ), 200);
    }

    public function get_admin_users() {
        $users = get_users(array('fields' => array('ID', 'user_email', 'display_name')));
        $data = array_map(function($user) {
            $slots = $this->get_user_slots($user->ID);
            $wallet = $this->get_user_wallet($user->ID);
            $orders = $this->get_user_orders($user->ID);
            return array(
                'id' => $user->ID,
                'name' => $user->display_name,
                'email' => $user->user_email,
                'slots' => $slots,
                'wallet' => $wallet,
                'orders' => count($orders),
            );
        }, $users);

        return new WP_REST_Response($data, 200);
    }

    public function admin_add_wallet($request) {
        $user_id = intval($request->get_param('id'));
        $body = $request->get_json_params();
        $amount = isset($body['amount']) ? floatval($body['amount']) : 0;
        if ($amount <= 0) {
            return new WP_Error('invalid_amount', 'Amount must be greater than zero.', array('status' => 400));
        }
        $current = $this->get_user_wallet($user_id);
        $this->set_user_wallet($user_id, $current + $amount);
        $this->add_transaction($user_id, $amount, 'admin_topup', 'admin');
        return new WP_REST_Response(array('wallet' => $this->get_user_wallet($user_id)), 200);
    }

    public function admin_add_slots($request) {
        $user_id = intval($request->get_param('id'));
        $body = $request->get_json_params();
        $slots = isset($body['slots']) ? intval($body['slots']) : 0;
        if ($slots <= 0) {
            return new WP_Error('invalid_slots', 'Slots must be greater than zero.', array('status' => 400));
        }
        $current = $this->get_user_slots($user_id);
        $this->set_user_slots($user_id, $current + $slots);
        return new WP_REST_Response(array('slots' => $this->get_user_slots($user_id)), 200);
    }

    public function admin_get_orders() {
        $users = get_users(array('fields' => 'ID'));
        $orders = array();
        foreach ($users as $user_id) {
            $userOrders = $this->get_user_orders($user_id);
            foreach ($userOrders as $order) {
                $order['userId'] = $user_id;
                $orders[] = $order;
            }
        }
        return new WP_REST_Response($orders, 200);
    }

}

Academic_Assist_Plugin::get_instance();

// Reset plugin state on activation to ensure all users start clean.
register_activation_hook(__FILE__, array('Academic_Assist_Plugin', 'on_activation'));

add_action('admin_init', function() {
    register_setting('academic_assist_options', 'academic_assist_telegram_token');
    register_setting('academic_assist_options', 'academic_assist_whatsapp');
    register_setting('academic_assist_options', 'academic_assist_email');

    // API / integration settings
    register_setting('academic_assist_options', 'academic_assist_turnitin_api_url');
    register_setting('academic_assist_options', 'academic_assist_turnitin_api_key');

    // Payment provider settings
    register_setting('academic_assist_options', 'academic_assist_paypal_client_id');
    register_setting('academic_assist_options', 'academic_assist_wise_account');
    register_setting('academic_assist_options', 'academic_assist_crypto_wallet');
    register_setting('academic_assist_options', 'academic_assist_payment_webhook');
});

