"use strict";

var utils = require("../utils");
var log = require("npmlog");

/**
 * Given a threadID, or an array of threadIDs, will set the
 * archive status of the threads to archive. Archiving a
 * thread will hide it from the logged-in user's inbox
 * until the next time a message is sent or received.
 * @function
 * @name changeArchivedStatus
 * @param {string|string[]|number|number[]} threadOrThreads The id(s) of the threads you wish to archive/unarchive
 * @param {boolean}                         archive         Boolean indicating the new archive status to assign to the thread(s)
 * @param {simpleErrorCallback}             callback        Callback called when the query is done
 * @example
 * const fs = require("fs");
 * const login = require("facebook-chat-api");
 *
 * login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
 *   if(err) return console.error(err);
 *   api.changeArchivedStatus("000000000000000", true, (err) => {
 *     if(err) return console.error(err);
 *   });
 * });
 * @memberof module:api
 */
module.exports = function(defaultFuncs, api, ctx) {
  return function changeArchivedStatus(threadOrThreads, archive, callback) {
    if (!callback) {
      callback = function() {};
    }

    var form = {};

    if (utils.getType(threadOrThreads) === "Array") {
      for (var i = 0; i < threadOrThreads.length; i++) {
        form["ids[" + threadOrThreads[i] + "]"] = archive;
      }
    } else {
      form["ids[" + threadOrThreads + "]"] = archive;
    }

    defaultFuncs
      .post(
        "https://www.facebook.com/ajax/mercury/change_archived_status.php",
        ctx.jar,
        form
      )
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("changeArchivedStatus", err);
        return callback(err);
      });
  };
};
