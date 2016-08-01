'use strict';

class PlugitError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
  }

  inspect() {
    return this.stack;
  }
}

module.exports = PlugitError;