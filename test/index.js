var assert = require('assert')
const parser = require("../utilities/parser");

var testRunner = {
  countTests: () => {
    var counter = 0;
    for (var testType in testRunner.testTypes) {
      if (testRunner.testTypes.hasOwnProperty(testType)) {
        var subtests = testRunner.testTypes[testType]
        for (var testName in subtests) {
          if (subtests.hasOwnProperty(testName)) {
            counter++;
          }
        } 
      }
    }
    return counter;
  },
  produceTestReport: (limit, successes, errors) => {
    console.log('')
    console.log('----BEGIN TEST REPORT----')
    console.log('Total tests: ', limit)
    console.log('Passed tests: ', successes)
    console.log('Failed tests: ', errors.length)
    console.log('')
    if (errors.length) {
      console.log('----BEGIN ERROR DETAILS----')
      errors.forEach((error) => {
        console.log('\x1b[31m%s\x1b[0m', error.name)
        console.log(error.error)
      })
      console.log('----END ERROR DETAILS----')
      console.log('----END TEST REPORTS----')
    }
  },
  runTests: () => {
    var errors = []
    var successes = 0
    var limit = testRunner.countTests()
    var counter = 0;
    for (var testType in testRunner.testTypes) {
      if (testRunner.testTypes.hasOwnProperty(testType)) {
        var subtests = testRunner.testTypes[testType]
        for (var testName in subtests) {
          if (subtests.hasOwnProperty(testName)) {
            (function() {
              var tempTestName = testName;
              var testFunction = subtests[testName]
              try {
                testFunction(() => {
                  console.log('\x1b[32m%s\x1b[0m', tempTestName)
                  counter++;
                  successes++;
                })
              } catch (error) {
                console.log('\x1b[31m%s\x1b[0m', tempTestName)
                counter++
                errors.push({ name: testName, error})
              } finally {
                if (counter == limit) {
                  testRunner.produceTestReport(limit, successes, errors)
                }
              }
            })();
          }
        }
      }
    }
  },
  testTypes: {
    unit: {
      "parser.stringToNumber should return a number": (done) => {
        var val = parser.getNumber()
        assert.equal(typeof(val), 'number')
        done()
      },
      "parser.stringToNumber should return number 1": (done) => {
        var val = parser.getNumber()
        assert.equal(val, 1)
        done()
      },
      "parser.stringToNumber should return number 2": (done) => {
        var val = parser.getNumber()
        assert.equal(val, 2)
        done()
      },
    }
  }
}

testRunner.runTests()