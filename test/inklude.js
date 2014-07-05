/**
 * Dependencies
 */
var inklude = require("../"),
    assert  = require("assert");

/**
 * Describe the Object
 */
describe("inklude", function () {

  it("should require all expected files", function (done) {
    inklude({
      dirname: process.cwd() + "/test/fixtures"
    }, function (err, res) {
      if (err) return done(err);
      return done(null, res);
    });
  });

  describe(".aggregate", function () {
    it("should melt all required OBJECTS together", function (done) {
      inklude.aggregate({
        dirname: process.cwd() + "/test/fixtures"
      }, function (err, res) {
        if (err) return done(err);
        return done(null, res);
      })
    });
  });

  describe(".optional", function () {
    it("fails if dir is invalid", function (done) {
      inklude({
        dirname: process.cwd() + "/test/fixture"
      }, function (err, res) {
        if (err) return done(null, err);
        return done(null, res);
      });
    });
  });
});
