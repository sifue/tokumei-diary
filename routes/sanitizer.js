'use strict';

const htmlspecialchars = require('htmlspecialchars');

/**
 * Escape HTML and URL to A tag
 * @param {String} text 
 * @return {String} sanitized
 */
function sanitizer(text) {
  const urlRegExp = new RegExp('((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))', 'g'); 
  const sanitized = htmlspecialchars(text);
  const linkAdded = sanitized.replace(urlRegExp, '<a href="$1">$1</a>')
  return linkAdded;
}

module.exports = sanitizer;