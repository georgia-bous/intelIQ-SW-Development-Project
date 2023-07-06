jest.setTimeout(60000)
const MongoClient = require('mongodb').MongoClient;
const { healthcheck } = require("../cli_functions.js");

describe('healthcheck', () => {
  test('it should return a resolved promise when the connection to the database is successful', async () => {
    // mock the MongoClient.connect function
    MongoClient.connect = jest.fn().mockImplementation((url, options, callback) => {
      // call the callback function with null error to indicate a successful connection
      callback(null, { close: jest.fn() });
    });

    const result = await healthcheck();
    expect(result).toBe(0);
    expect(MongoClient.connect).toHaveBeenCalled();
  });

  test('it should return a rejected promise when the connection to the database fails', async () => {
    // mock the MongoClient.connect function
    MongoClient.connect = jest.fn().mockImplementation((url, options, callback) => {
      // call the callback function with an error to indicate a failed connection
      callback(new Error('Connection failed'), null);
    });

    try {
      await healthcheck();
    } catch (error) {
      expect(error.message).toBe('Connection failed');
      expect(MongoClient.connect).toHaveBeenCalled();
    }
  });
});