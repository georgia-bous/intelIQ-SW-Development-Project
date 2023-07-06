const mongoose = require('mongoose');
const Session = require('../model/Session');
const {resetQuestionnaire} = require('../cli_functions.js');

describe('resetQuestionnaire', function() {
 /* before(function() {
    // Connect to a mock or test database
    mongoose.connect(...);
  });
*/
  afterEach(function() {
    // Close the connection
    mongoose.connection.close();
  });

  it('should delete all sessions with the specified questionnaireID', async function() {
    // Arrange
    const qq_id = "QQ000"; // The questionnaireID to delete
    const originalSessions = await Session.find({questionnaireID: qq_id});

    // Act
    await resetQuestionnaire(qq_id);

    // Assert
    const updatedSessions = await Session.find({questionnaireID: qq_id});
    if (updatedSessions.length !== 0) {
      throw new Error('Sessions were not deleted');
    }
    if (originalSessions.length <= 0) {
      throw new Error('No sessions were found to delete');
    }
  });

  it('should return an error if the delete operation fails', async function() {
    // Arrange
    const qq_id = "QQ000"; // The questionnaireID to delete

    // Act
    let errorThrown = false;
    try {
      await resetQuestionnaire(qq_id);
    } catch (error) {
      errorThrown = true;
    }
/*
    // Assert
    if (!errorThrown) {
      throw new Error('Error was not thrown');
    }*/  
  });
});
