'use strict';

class ApplicationError extends Error {
  constructor(error) {
    super(error.message);
    this.code = this.constructor.name;
    this.message = error.message;
    Error.captureStackTrace(this, this.constructor.name);
    if (error instanceof Error) {
      this.parent = error;
    }
    this.expandParent();
  }

  expandParent() {
    const parentStack = [];

    if (this.parent instanceof Error) {
      parentStack.push({
        name: this.parent.name,
        message: this.parent.message,
        stack: this.parent.stack
      });
    }
    if (this.parent instanceof ApplicationError) {
      parentStack.concat(this.parent.expandParent());
    }

    this.parents = parentStack;
    return parentStack;

  }
}

module.exports = {
  ApplicationError
};