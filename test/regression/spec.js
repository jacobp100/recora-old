/* eslint quotes: [0] */

export default [
  { "input": "5", "output": "5" },
  { "input": "100", "output": "100" },
  { "input": "-3", "output": "-3" },
  { "input": "1 + 2", "output": "3" },
  { "input": "5 - 2", "output": "3" },
  { "input": "3 * 3", "output": "9" },
  { "input": "9 / 3", "output": "3" },
  { "input": "3 * -3", "output": "-9" },
  { "input": "3 ** 2", "output": "9" },
  { "input": "3 ^ 2", "output": "9" },
  { "input": "1.5 + 2.77", "output": "4.27" },
  { "input": "1.5 * 1.77", "output": "2.66" },
  { "input": "7 / 2.4", "output": "2.92" },
  { "input": "2 * 1 + 1", "output": "3" },
  { "input": "2 * 1 - 1", "output": "1" },
  { "input": "1 + 1 * 2", "output": "3" },
  { "input": "1 - 1 * 2", "output": "-1" },
  { "input": "1 + 4 / 2", "output": "3" },
  { "description": "perform exponentiation right-to-left", "input": "4 ** 3 ** 2", "output": "262144" },
  { "description": "perform exponentiation after negation", "input": "4 ** 3 ** -2", "output": "1.17" },
  { "description": "perform exponentiation after negation", "input": "4 ** -3 ** -2", "output": "0.857" },
  { "description": "perform exponentiation after negation", "input": "4 ** -3 ** 2", "output": "0.00000381" },
  { "description": "perform exponentiation after negation", "input": "-4 ** -3 ** 2", "output": "-0.00000381" },
  { "description": "perform exponentiation after negation", "input": "-4 ** 3 ** 2", "output": "-262144" },
  { "input": "1 meter to yards", "output": "1.09 yards" },
  { "input": "1 minute to seconds", "output": "60 seconds" },
  { "input": "3 feet 4 inches to cm", "output": "102 centimeters" },
  { "input": "1 meter + 1 yard to centimeters", "output": "191 centimeters" },
  { "input": "kilometers in 1 mile", "output": "1.61 kilometers" },
  { "input": "ounces in 1kg", "output": "35.3 ounces" },
  { "input": "1 meter + 1 yard", "output": "1.91 meters" },
  { "input": "1kg - 1 ounce", "output": "972 grams" },
  { "description": "not add", "input": "1 meter + 1", "output": "" },
  { "input": "3 + -1", "output": "2" },
  { "input": "3 + - 1", "output": "2" },
  { "input": "100 celsius to kelvin", "output": "373 Kelvin" },
  { "input": "180 celsius to fahrenheit", "output": "356℉" },
  { "input": "180 centigrade to celsius", "output": "180℃" },
  { "input": "gas mark 4 to celsius", "output": "180℃" },
  { "input": "4 gas mark to celsius", "output": "180℃" },
  { "input": "180 degrees centigrade to gas mark", "output": "Gas mark 4" },
  { "input": "3 feet 4 inches to centimetres", "output": "102 centimeters" },
  { "input": "-------4", "output": "-4" },
  { "input": "1------1", "output": "2" },
  { "input": "180 degrees + 3.14 radians", "output": "6.28" },
  { "input": "5 kilos at £1/kg", "output": "£5.00" },
  { "input": "£5 using £1/kg", "output": "5 kilograms" },
  { "input": "70km using 35 miles per gallon", "output": "5.65 liters" },
  { "input": "70km using 35 miles per gallon at £1.20 per liter", "output": "£6.78" },
  { "input": "1 meter to feet and inches", "output": "3 feet 3 inches" },
  { "input": "500m to yards, feet and inches", "output": "546 yards 2 feet 5 inches" },
  { "input": "1 gallon to meters^3", "output": "0.00455 meters³" },
  { "input": "1 gigajoules to kilowatt hours", "output": "278 kilowatts hours" },
  { "input": "1 joule per second to watts", "output": "1 Watt" },
  { "input": "2 * (1 + 1)", "output": "4" },
  // { "input": "(1 meter to yards) + (1 kilometer to miles)", "output": "1,001 meters" },
  { "input": "sin(1)", "output": "0.841" },
  { "input": "sin(1 + 1)", "output": "0.909" },
  { "input": "sin(35 degrees)", "output": "0.574" },
  { "input": "2 sin(30 degrees)", "output": "1.000" },
  { "input": "sqrt(4)", "output": "2" },
  { "input": "-sqrt(4)", "output": "-2" },
  { "input": "sin(1)", "output": "0.841" },
  { "input": "sqrt(2 + 2)", "output": "2" },
  { "description": "accept shorthand", "input": "sin 35 degrees", "output": "0.574" },
  { "description": "accept shorthand", "input": "2 sin 30 degrees", "output": "1.000" },
  { "description": "accept shorthand", "input": "sqrt 4", "output": "2" },
  { "description": "accept shorthand", "input": "-sqrt 4", "output": "-2" },
  { "description": "accept shorthand", "input": "sqrt 4 + 1", "output": "3" },
  { "description": "accept shorthand", "input": "sqrt^2(4)", "output": "4" },
  { "description": "accept shorthand", "input": "sqrt sqrt 16", "output": "2" },
  { "input": "2gb at 50kb/s to hours, minutes and seconds", "output": "11 hours 6 minutes 40 seconds" },
  { "input": "1 yard to feet and inches", "output": "3 feet 0 inches" },
  { "input": "2000 kibibits to mebibits", "output": "1.95 mebibits" },
  { "input": "2000 kilobytes to megabytes", "output": "2 megabytes" },
  { "input": "2 mebibytes to kibibytes", "output": "2,048 kibibytes" },
  { "input": "2000 kibibytes to mebibytes", "output": "1.95 mebibytes" },
  // { "description": "pretty print", "input": "1 / 4", "output": "1 / 4 or 0.250" },
  // { "description": "pretty print", "input": "2 / 4", "output": "1 / 2 or 0.500" },
  // { "description": "pretty print", "input": "3 / 4", "output": "3 / 4 or 0.750" },
  // { "description": "pretty print", "input": "1 / 5", "output": "1 / 5 or 0.200" },
  // { "description": "pretty print", "input": "2 / 5", "output": "2 / 5 or 0.400" },
  // { "description": "pretty print", "input": "3 / 5", "output": "3 / 5 or 0.600" },
  // { "description": "pretty print", "input": "4 / 5", "output": "4 / 5 or 0.800" },
  // { "input": "sin(60 degrees)", "output": "√(3) / 2 or 0.866" },
  // { "description": "fix sin pi", "input": "sin(pi)", "output": "0" },
  { "input": "1km to meters", "output": "1,000 meters" },
  { "input": "1 acre to square meters", "output": "4,047 meters²" },
  { "input": "1 acre to meters squared", "output": "4,047 meters²" },
  { "description": "resolve constant", "input": "pi", "output": "3.14" },
  { "description": "resolve constant", "input": "e", "output": "2.72" },
  { "description": "resolve constant", "input": "2pi", "output": "6.28" },
  { "description": "resolve constant", "input": "2e^2", "output": "14.8" },
  { "description": "resolve constant", "input": "0pi", "output": "0" },
  { "input": "10 + 10%", "output": "11" },
  { "input": "10 - 10%", "output": "9" },
  { "input": "10 * 10%", "output": "1" },
  { "input": "10 / 10%", "output": "100" },
  { "input": "10 meters + 10%", "output": "11 meters" },
  { "input": "10 meters - 10%", "output": "9 meters" },
  // { "input": "2x - 5 = 0", "output": "x = 5 / 2 or 2.500000" },
  // { "input": "2x = 5", "output": "x = 5 / 2 or 2.500000" },
  // { "input": "x^2 + 2x - 1 = 0", "output": "x = 0.414214; x = -2.414214" },
  // { "input": "2test = 5", "output": "test = 5 / 2 or 2.500000" },
  // { "input": "testing^2 + 2testing - 1 = 0", "output": "testing = 0.414214; testing = -2.414214" },
  // { "input": "hello^2 = 16", "output": "hello = 4.000000; hello = -4.000000" },
  // { "input": "x^5 + 2x = 8", "output": "x = 1.391503" },
  // { "input": "sin(x) + cos(x) = 0", "output": "x = 5.497787" },
  // { "input": "sin(x) + cos(x) - x^2 = 0", "output": "x = 1.149555" },
  { "input": "meters in a kilometer", "output": "1,000 meters" },
  { "input": "1000 meters a in kilometer", "output": "1 kilometer" },
  // { "description": "solve", "input": "2a = 5", "output": "a = 5 / 2 or 2.500000" },
  { "input": "5 meters per second to kilometers per hour", "output": "18 kilometers per hour" },
  { "input": "5 meters / second to kilometers / hour", "output": "18 kilometers per hour" },
  { "input": "5 meters per second to kilometers / hour", "output": "18 kilometers per hour" },
  { "input": "5 meters / second to kilometers per hour", "output": "18 kilometers per hour" },
  { "input": "20cm by 20cm", "output": "400 centimeters²" },
  { "input": "20cm by 20cm by 20cm", "output": "8000 centimeters³" },
  { "input": "1 foot 5 inches", "output": "0.432 meters" },
  { "input": "1 pounds sterling to us dollars", "output": "$1.00" },
  { "input": "1 canadian dollars to korean won", "output": "1.00 KRW" },
  { "input": "1 american dollars to swiss francs", "output": "1.00 CHF" },
  { "input": "1 brazilian real to hong kong dollars", "output": "1.00 HKD" },
  { "input": "1 Hungarian forint to Chinese yuan", "output": "1.00 CNY" },
  { "input": "1 forint to Chinese yuan", "output": "1.00 CNY" },
  { "input": "1 us dollar to mexican peso", "output": "1.00 MXN" },
  { "input": "1 mexican peso to euro", "output": "1.00€" },
  // { "input": "1000 us cup to fluid ounces", "output": "8,292 fluid ounces" },
  // { "input": "1992/12/4", "output": "Friday, 4th December 1992" },
  // { "input": "1992/12/4 + 30 days", "output": "Sunday, 3rd January 1993" },
  // { "input": "1992/12/4 + 1 year", "output": "Saturday, 4th December 1993" },
  // { "input": "1992/12/4 - 1 century", "output": "Sunday, 4th December 1892" },
  // { "input": "1992/12/4 until 1993/6/18", "output": "196 days" },
  // { "input": "next week", "output": "Midnight Thursday, 8th January 1970" },
  // { "input": "last week", "output": "Midnight Thursday, 25th December 1969" },
  // { "input": "next week to days", "output": "7 days" },
  // { "input": "now", "output": "Midnight Thursday, 1st January 1970" },
  // { "input": "2 weeks + now", "output": "Thursday, 15th January 1970" },
  // { "input": "2 weeks from now", "output": "Thursday, 15th January 1970" },
  // { "input": "2 weeks ago", "output": "Thursday, 18th December 1969" },
  // { "input": "2 weeks ago until next week in days", "output": "21 days" },
  // { "input": "13 hours from now", "output": "1:00PM, Thursday, 1st January 1970" },
  // { "input": "5th jan 2015", "output": "Monday, 5th January 2015" },
  // { "input": "5 jan 2015", "output": "Monday, 5th January 2015" },
  // { "input": "6pm 5th jan 2015", "output": "6:00PM, Monday, 5th January 2015" },
  // { "input": "6:53 5th jan 2015", "output": "6:53AM, Monday, 5th January 2015" },
  // { "input": "6:07 5th jan 2015", "output": "6:07AM, Monday, 5th January 2015" },
  // { "input": "jan 5th 2015", "output": "Monday, 5th January 2015" },
  // { "input": "2015 jan 5th", "output": "Monday, 5th January 2015" },
  // { "input": "6:07:35 5th jan 2015", "output": "6:07:35AM, Monday, 5th January 2015" },
  { "input": "mortgage is -£10 per month", "output": "£-10.00 per month" },
  { "input": "Convert 1 meter to yards please", "output": "1.09 yards" },
  { "input": "How many yards are there in 100 meters?", "output": "109 yards" },
  { "input": "How many ounces can I buy with £5 at $1/kg", "output": "176 ounces" },
  // { "input": "sin", "output": "" },
  // { "input": "sin(", "output": "" },
  // { "input": "sin(2 * )", "output": "" },
  // { "input": "1 *", "output": "" },
  // { "input": "hsl(5)", "output": "5" },
  // { "input": "500 to hexadecimal", "output": "0x1f4" },
  { "input": "#f00", "output": "#ff0000" },
  // { "input": "rgb(128, 0, 0)", "output": "#800000" },
  // { "input": "hsl(0, 100%, 1)", "output": "#ffffff" },
  // { "input": "hsl(0, 100%, 0.5)", "output": "#ff0000" },
  // { "input": "#800000 to hsl", "output": "hsl(0°, 100%, 25%)" },
  // { "input": "#123456 to hsl", "output": "hsl(210°, 65%, 20%)" },
  // { "input": "hsl(0, 1, 0)", "output": "#000000" },
  // { "input": "hsl(180 degrees, 1, 0.5)", "output": "#00ffff" },
  // { "input": "hsl(0, 0, 0.5)", "output": "#808080" },
  // { "input": "hsl(210 degrees, 65%, 20%)", "output": "#123354" },
  // { "input": "hsl(210 degrees, 65%, 20%) to rgb", "output": "rgb(18, 51, 84)" },
  // { "input": "rgb(18, 51, 84) to hsl", "output": "hsl(210°, 65%, 20%)" },
  // { "input": "hsl(0, 100%, 0.5) to hsl", "output": "hsl(0°, 100%, 50%)" },
  { "input": "#f00 + #0f0", "output": "#ffff00" },
  { "input": "#f00 + #f00", "output": "#ff0000" },
  { "input": "#f00 - #800", "output": "#770000" },
  { "input": "#700 + #800", "output": "#ff0000" },
  { "input": "#888 * #888", "output": "#494949" },
  { "input": "#888 / #888", "output": "#ffffff" },
  { "input": "#888 / #fff", "output": "#888888" },
  // { "input": "#888 ** 2", "output": "#494949" },
  // { "input": "darken(#FF0000, 25%)", "output": "#800000" },
  // { "input": "lighten(#800000, 50%)", "output": "#ff8080" },
  // { "input": "mix(#800000, #ff0000)", "output": "#c00000" },
  // { "input": "mix(#800000, #ff0000, 30%)", "output": "#a60000" },
  // { "input": "darken(rgb(255, 0, 0), 50%)", "output": "#000000" },
  // { "input": "darken(hsl(0, 100%, 1), 50%)", "output": "#ff0000" },
  // { "input": "darken(hsl(0, 100%, 0.5), 50%)", "output": "#000000" },
  // { "input": "screen(#123456, #345678)", "output": "#4278a6" },
  // { "input": "overlay(#123456, #345678)", "output": "#072351" },
  // { "input": "dodge(#123456, #345678)", "output": "#386cb5" },
  // { "input": "burn(#ccc, #ccc)", "output": "#bfbfbf" },
  // { "input": "#800 * 2", "output": "#ff0000" },
  // { "input": "#f00 / 2", "output": "#800000" },
  { "input": "#800 + 20%", "output": "#ee0000" },
  { "input": "#800 - 20%", "output": "#220000" },
  { "input": "#800 * #880", "output": "#490000" },
  { "input": "#800 / #880", "output": "#ff0000" },
  { "input": "red", "output": "#ff0000" },
  { "input": "red + lime", "output": "#ffff00" }
]
