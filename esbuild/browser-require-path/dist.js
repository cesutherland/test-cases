(() => {
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };

  // node_modules/unist-util-stringify-position/index.js
  var require_unist_util_stringify_position = __commonJS((exports, module) => {
    "use strict";
    var own = {}.hasOwnProperty;
    module.exports = stringify;
    function stringify(value) {
      if (!value || typeof value !== "object") {
        return "";
      }
      if (own.call(value, "position") || own.call(value, "type")) {
        return position(value.position);
      }
      if (own.call(value, "start") || own.call(value, "end")) {
        return position(value);
      }
      if (own.call(value, "line") || own.call(value, "column")) {
        return point(value);
      }
      return "";
    }
    function point(point2) {
      if (!point2 || typeof point2 !== "object") {
        point2 = {};
      }
      return index(point2.line) + ":" + index(point2.column);
    }
    function position(pos) {
      if (!pos || typeof pos !== "object") {
        pos = {};
      }
      return point(pos.start) + "-" + point(pos.end);
    }
    function index(value) {
      return value && typeof value === "number" ? value : 1;
    }
  });

  // node_modules/vfile-message/index.js
  var require_vfile_message = __commonJS((exports, module) => {
    "use strict";
    var stringify = require_unist_util_stringify_position();
    module.exports = VMessage;
    function VMessagePrototype() {
    }
    VMessagePrototype.prototype = Error.prototype;
    VMessage.prototype = new VMessagePrototype();
    var proto = VMessage.prototype;
    proto.file = "";
    proto.name = "";
    proto.reason = "";
    proto.message = "";
    proto.stack = "";
    proto.fatal = null;
    proto.column = null;
    proto.line = null;
    function VMessage(reason, position, origin) {
      var parts;
      var range;
      var location;
      if (typeof position === "string") {
        origin = position;
        position = null;
      }
      parts = parseOrigin(origin);
      range = stringify(position) || "1:1";
      location = {
        start: {line: null, column: null},
        end: {line: null, column: null}
      };
      if (position && position.position) {
        position = position.position;
      }
      if (position) {
        if (position.start) {
          location = position;
          position = position.start;
        } else {
          location.start = position;
        }
      }
      if (reason.stack) {
        this.stack = reason.stack;
        reason = reason.message;
      }
      this.message = reason;
      this.name = range;
      this.reason = reason;
      this.line = position ? position.line : null;
      this.column = position ? position.column : null;
      this.location = location;
      this.source = parts[0];
      this.ruleId = parts[1];
    }
    function parseOrigin(origin) {
      var result = [null, null];
      var index;
      if (typeof origin === "string") {
        index = origin.indexOf(":");
        if (index === -1) {
          result[1] = origin;
        } else {
          result[0] = origin.slice(0, index);
          result[1] = origin.slice(index + 1);
        }
      }
      return result;
    }
  });

  // node_modules/replace-ext/index.js
  var require_replace_ext = __commonJS((exports, module) => {
    "use strict";
    var path2 = require("path");
    function replaceExt(npath, ext) {
      if (typeof npath !== "string") {
        return npath;
      }
      if (npath.length === 0) {
        return npath;
      }
      var nFileName = path2.basename(npath, path2.extname(npath)) + ext;
      return path2.join(path2.dirname(npath), nFileName);
    }
    module.exports = replaceExt;
  });

  // node_modules/is-buffer/index.js
  var require_is_buffer = __commonJS((exports, module) => {
    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    module.exports = function isBuffer(obj) {
      return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    };
  });

  // node_modules/vfile/core.js
  var require_core = __commonJS((exports, module) => {
    "use strict";
    var path2 = require("path");
    var replace = require_replace_ext();
    var buffer = require_is_buffer();
    module.exports = VFile;
    var own = {}.hasOwnProperty;
    var proto = VFile.prototype;
    var order = ["history", "path", "basename", "stem", "extname", "dirname"];
    proto.toString = toString;
    Object.defineProperty(proto, "path", {get: getPath, set: setPath});
    Object.defineProperty(proto, "dirname", {get: getDirname, set: setDirname});
    Object.defineProperty(proto, "basename", {get: getBasename, set: setBasename});
    Object.defineProperty(proto, "extname", {get: getExtname, set: setExtname});
    Object.defineProperty(proto, "stem", {get: getStem, set: setStem});
    function VFile(options) {
      var prop;
      var index;
      var length;
      if (!options) {
        options = {};
      } else if (typeof options === "string" || buffer(options)) {
        options = {contents: options};
      } else if ("message" in options && "messages" in options) {
        return options;
      }
      if (!(this instanceof VFile)) {
        return new VFile(options);
      }
      this.data = {};
      this.messages = [];
      this.history = [];
      this.cwd = process.cwd();
      index = -1;
      length = order.length;
      while (++index < length) {
        prop = order[index];
        if (own.call(options, prop)) {
          this[prop] = options[prop];
        }
      }
      for (prop in options) {
        if (order.indexOf(prop) === -1) {
          this[prop] = options[prop];
        }
      }
    }
    function getPath() {
      return this.history[this.history.length - 1];
    }
    function setPath(path3) {
      assertNonEmpty(path3, "path");
      if (path3 !== this.path) {
        this.history.push(path3);
      }
    }
    function getDirname() {
      return typeof this.path === "string" ? path2.dirname(this.path) : void 0;
    }
    function setDirname(dirname) {
      assertPath(this.path, "dirname");
      this.path = path2.join(dirname || "", this.basename);
    }
    function getBasename() {
      return typeof this.path === "string" ? path2.basename(this.path) : void 0;
    }
    function setBasename(basename) {
      assertNonEmpty(basename, "basename");
      assertPart(basename, "basename");
      this.path = path2.join(this.dirname || "", basename);
    }
    function getExtname() {
      return typeof this.path === "string" ? path2.extname(this.path) : void 0;
    }
    function setExtname(extname) {
      var ext = extname || "";
      assertPart(ext, "extname");
      assertPath(this.path, "extname");
      if (ext) {
        if (ext.charAt(0) !== ".") {
          throw new Error("`extname` must start with `.`");
        }
        if (ext.indexOf(".", 1) !== -1) {
          throw new Error("`extname` cannot contain multiple dots");
        }
      }
      this.path = replace(this.path, ext);
    }
    function getStem() {
      return typeof this.path === "string" ? path2.basename(this.path, this.extname) : void 0;
    }
    function setStem(stem) {
      assertNonEmpty(stem, "stem");
      assertPart(stem, "stem");
      this.path = path2.join(this.dirname || "", stem + (this.extname || ""));
    }
    function toString(encoding) {
      var value = this.contents || "";
      return buffer(value) ? value.toString(encoding) : String(value);
    }
    function assertPart(part, name) {
      if (part.indexOf(path2.sep) !== -1) {
        throw new Error("`" + name + "` cannot be a path: did not expect `" + path2.sep + "`");
      }
    }
    function assertNonEmpty(part, name) {
      if (!part) {
        throw new Error("`" + name + "` cannot be empty");
      }
    }
    function assertPath(path3, name) {
      if (!path3) {
        throw new Error("Setting `" + name + "` requires `path` to be set too");
      }
    }
  });

  // node_modules/vfile/index.js
  var require_vfile = __commonJS((exports, module) => {
    "use strict";
    var VMessage = require_vfile_message();
    var VFile = require_core();
    module.exports = VFile;
    var proto = VFile.prototype;
    proto.message = message;
    proto.info = info;
    proto.fail = fail;
    function message(reason, position, origin) {
      var filePath = this.path;
      var message2 = new VMessage(reason, position, origin);
      if (filePath) {
        message2.name = filePath + ":" + message2.name;
        message2.file = filePath;
      }
      message2.fatal = false;
      this.messages.push(message2);
      return message2;
    }
    function fail() {
      var message2 = this.message.apply(this, arguments);
      message2.fatal = true;
      throw message2;
    }
    function info() {
      var message2 = this.message.apply(this, arguments);
      message2.fatal = null;
      return message2;
    }
  });

  // index.js
  const path = require("path");
  const vfile = require_vfile();
})();
