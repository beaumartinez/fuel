#! /usr/bin/env casperjs

var casper = require('casper').create({
    logLevel: 'debug',
    verbose: false,
    viewportSize: {
        width: 1280,
        height: 800,
    },
    pageSettings: {
        loadImages: false,
    },
    waitTimeout: 10000,
});
var fs = require('fs');

var LOGIN_URL = 'http://nikeplus.nike.com/plus/';

(function() {
    var currentUrl;
    var email;
    var frameName;
    var fuel = new Object();
    var password;

    function waitForUrlChange() {
        casper.waitFor(function() {
            return casper.getCurrentUrl() !== currentUrl;
        }, function() {
            currentUrl = casper.getCurrentUrl();
        });
    }

    function getData() {
        casper.then(function doShitWithData() {
            var date = casper.evaluate(function() {
                return window.np.baked_data.activity.localStart.utcTime;
            });

            var data = casper.evaluate(function() {
                return window.np.baked_data.dataPoints;
            });
            data = data.map(function(x) {
                return x.fuel;
            });

            fuel[date] = data;

            var serializedFuel = JSON.stringify(fuel, null, 4);
            fs.write('fuel.json', serializedFuel, 'w');

            var serializedDate = new Date(date);
            console.log('Wrote', serializedDate);
        });

        casper.then(function clickPreviousLink() {
            casper.click('a.previous');
            casper.then(waitForUrlChange);
        });

        casper.then(getData);
    }

    (function() {
        casper.start(LOGIN_URL, function getLoginFrameName() {
            frameName = casper.evaluate(function() {
                var frame = document.getElementById('checkers');

                return frame.name;
            });

            currentUrl = casper.getCurrentUrl();
        });

        casper.then(function submitLoginForm() {
            casper.withFrame(frameName, function() {
                casper.evaluate(function(email, password) {
                    var form = document.querySelector('form');

                    var emailNode = form.querySelector('input[type=email]');
                    emailNode.value = email;

                    var passwordNode = form.querySelector('input[type=password]');
                    passwordNode.value = password;

                    // Submitting like this because form.submit() doesn't work
                    var submit = form.querySelector('input[type=submit]');
                    submit.click();
                }, {
                    email: email,
                    password: password,    
                });
            });

            casper.then(waitForUrlChange);
        });

        casper.then(function changeLocaleIfWrong() {
            var localeText = casper.evaluate(function() {
                var localeLink = document.querySelector('a#footer_region_link');
                var localeText = localeLink.innerText;
                localeText = toLowerCase();

                return localeText;
            });

            if (localeText !== 'english') {
                casper.click('a#footer_region_link');
                casper.then(waitForUrlChange);

                casper.then(function clickValidLocaleLink() {
                    // Have to hover over "English" link to see all English locales
                    casper.evaluate(function() {
                        var link = document.querySelector('a[rel=english]');
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('mouseover', true, false);
                        link.dispatchEvent(event);
                    });

                    var validLocaleLinkSelector = 'a[rel=en_GB]';
                    casper.waitUntilVisible(validLocaleLinkSelector, function() {
                        casper.click(validLocaleLinkSelector);
                    });
                    casper.then(waitForUrlChange);
                });
            }
        });

        casper.then(function clickActivityLink() {
            casper.click('a[title=Activity]');

            casper.then(waitForUrlChange);
        });

        casper.then(function clickLastSyncBar() {
            casper.evaluate(function() {
                var links = document.querySelectorAll('a.bar_shim');
                var lastLink = links[links.length - 1];

                window.location = lastLink.href;
            });

            casper.then(waitForUrlChange);
        });

        casper.then(getData);

        if (casper.cli.args.length < 2) {
            console.log('Usage: ./fuel.js <email> <password>');
            casper.exit();
        }

        email = casper.cli.args[0];
        password = casper.cli.args[1];

        casper.run();
    })();
})();
