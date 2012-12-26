# NikeFuel Scraper

If you're like me, you feel real smug wearing a [FuelBand][fuelband] and
wouldn't mind access to its data. Unfortunately, there's no easy way to do
that. [Nike won't publish an API][api], so they've given me No Choice™ and I've
built a scraper.

Now [their web app][web app] is no GeoCities website—it's a JavaScript-heavy
"modern" web app, with iframes and all types of scary magic. Its graphs use
canvas, so DOM scraping is out of the question. However we *can* get the graph
data from a global JavaScript variable.

(If it wasn't in a global variable, I sure hope you could programmatically
debug PhantomJS's WebKit browser's JavaScript engine, otherwise you'd be pretty
fucked. We'd have to parse the JavaScript code responsbile and extract the
value somehow.)

This script extracts all your FuelBand data to a JSON file. The JSON file is a
map of days (as JavaScript timestamps) to an array of Fuel. The array contains
96 elements, one for each 15 minutes of the day. (Hey, that's even more
granular than the graphs on the app!)

This is what it looks like:

    {
        "1356393600000": [
            13,
            57,
            0,
            0,
            2,
            1,
            0,
            0,
            0,
            0,
            3,
            2,
            22,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            0,
            0,
            0,
            2,
            0,
            8,
            15,
            33,
            2,
            105,
            99,
            31,
            32,
            23,
            5,
            35,
            76,
            76,
            21,
            51,
            34,
            30,
            37,
            44,
            42,
            50,
            7,
            6,
            5,
            18,
            62,
            4,
            2,
            0,
            2,
            1,
            0,
            3,
            0,
            53,
            51,
            7,
            2,
            8,
            49,
            18,
            7,
            3,
            59,
            7,
            20,
            16,
            28,
            30,
            62,
            41,
            32,
            17,
            24,
            32,
            9,
            8,
            14,
            4,
            17,
            28
        ],
    }

Use with care.

## Requirements

- [CasperJS](http://casperjs.org/)
    - [PhantomJS](http://phantomjs.org/)

And a FuelBand and a Nike+ account, of course.

## Usage

    fuel.js <email> <password>

## Notes

The web app is a bit buggy in places—I've seen it skip days (yes, the web
app—not the scraper) when you click "previous".

[api]: https://twitter.com/NikeFuel/status/205424488836370433
[fuelband]: http://www.nike.com/us/en_us/lp/nikeplus-fuelband
[web app]: http://nikeplus.nike.com/plus/
