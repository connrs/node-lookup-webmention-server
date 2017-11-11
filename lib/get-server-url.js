var cheerio = require('cheerio');

function getServerUrl(linkHeaders, body, callback) {
  var url = findUrlFromLinkHeaders(linkHeaders);

  if (url) {
    callback(null, url);
  }
  else {
    findUrlFromBody(body, callback);
  }
}

function findUrlFromLinkHeaders(linkHeaders) {
  return linkHeaders.filter(filterWebmentionServers).map(mapWebmentionServers)[0];
}

function findUrlFromBody(body, callback) {
  var $ = cheerio.load(body);
  $('link').each(function(idx, el) {
    if (relIsWebmentionMatch(el.attribs.rel)) {
      callback(null, el.attribs.href);
      return;
    }
  });

  callback();
}

function relIsWebmentionMatch(rel) {
  return rel.match(/^webmention$/) || rel.match(/^http:\/\/webmention\.org/);
}

function filterWebmentionServers(header) {
  var match = matchWebmentionServer(header);

  return match.length === 2;
}

function mapWebmentionServers(header) {
  var match = matchWebmentionServer(header);

  if (match.length === 2) {
    return match[1];
  }
}

function matchWebmentionServer(header) {
  return header.match(/<(https?:\/\/[^>]+)>; rel=\"http:\/\/webmention.org\/\"/);
}

module.exports = getServerUrl;
