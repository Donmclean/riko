const config = require('./src/rikoconfig') || {};

const nightwatchConfig = {
    "src_folders" : ["src/__tests-selenium"],
    "output_folder" : "test-coverage/nightwatch-selenium",
    "custom_commands_path" : "",
    "custom_assertions_path" : "",
    "page_objects_path" : "",
    "globals_path" : "",

    "selenium" : {
        "start_process" : true,
        "start_session" : true,
        "server_path" : "node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.0.1.jar",
        "log_path" : "",
        "host" : "127.0.0.1",
        "port" : 4444,
        "cli_args" : {
            "webdriver.chrome.driver" : "./bin/webdrivers/chromedriver"
        }
    },

    "test_settings" : {
        "chrome" : {
            "desiredCapabilities": {
                "browserName": "chrome",
                "javascriptEnabled": true,
                "acceptSslCerts": true
            }
        },
        "firefox" : {
            "desiredCapabilities": {
                "browserName": "firefox",
                "javascriptEnabled": true,
                "acceptSslCerts": true
            }
        },
        "safari" : {
            "desiredCapabilities": {
                "browserName": "safari",
                "javascriptEnabled": true,
                "acceptSslCerts": true
            }
        },
        "browserstack-chrome" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "chrome",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-firefox" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "firefox",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-safari" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "safari",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-ie10" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "IE",
                "browser_version" : "10.0",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-ie11" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "IE",
                "browser_version" : "11.0",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-android" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "android",
                "platform" : "ANDROID",
                "device" : "Samsung Galaxy S5",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-iphone6" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "iPhone",
                "platform" : "MAC",
                "device" : "iPhone 6S",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        },
        "browserstack-ipad2" : {
            "launch_url" : "http://hub.browserstack.com",
            "selenium_port"  : 80,
            "selenium_host"  : "hub.browserstack.com",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : ""
            },
            "desiredCapabilities": {
                "browserName": "iPad",
                "platform" : "MAC",
                "device" : "iPad 2 (5.0)",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "browserstack.user": config.browserstackUsername,
                "browserstack.key": config.browserstackAccessKey
            }
        }
    }
};

module.exports = nightwatchConfig;