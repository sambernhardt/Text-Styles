var {styles} = require("../styles");
var standard = "abcdefghijklmnopqrstuvwxyz".split("");

exports.toUnicode = function(string, style) {
  var result = "";
  var styleAlphabet = styles[style];

  for (var i = 0; i < string.length; i++) {
      var letter = string.charAt(i);
      var index = standard.indexOf(letter);

      if (index >= 0) {
        if (styleAlphabet.length == 52) {
          result += getLetter52(styleAlphabet, index)
        } else if (styleAlphabet.length == 26){
          result += styleAlphabet[index];
        }
      } else {
        result += letter;
      }
  }

  return result;
}

function getLetter52(alphabet, index) {
  index = index * 2;
  return alphabet[index] + alphabet[index + 1];
}
