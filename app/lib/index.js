exports.openBrowser = require('./browserlib').openBrowser;
exports.openPage = require('./browserlib').openPage;
exports.handleCookiesAcceptWindow = require('./browserlib').handleCookiesAcceptWindow;

exports.clickFind = require('./advlisthandlers').clickFind;
exports.skipPromotionAdverts = require('./advlisthandlers').skipPromotionAdverts;
exports.getTheTextOfLatestAdvert = require('./advlisthandlers').getTheTextOfLatestAdvert;
exports.getLatestTimestampOfAdvertOnPage = require('./advlisthandlers').getLatestTimestampOfAdvertOnPage;
exports.getTheTextOfAdvertAt = require('./advlisthandlers').getTheTextOfAdvertAt;
exports.skipPromotionAdverts = require('./advlisthandlers').skipPromotionAdverts;


exports.openTheAdvertPage = require('./adverthandler').openTheAdvertPage;
exports.readVisitedAdverts = require('./ebaylib').readVisitedAdverts;
exports.openMissedAdverts = require('./ebaylib').openMissedAdverts;
exports.handleLatestAdvert = require('./adverthandler').handleLatestAdvert;