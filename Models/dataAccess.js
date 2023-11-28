const User = require('./User.model');

async function insertUsers() {
  try {
    // Insert 100 users with email and password
    const usersToInsert = Array.from({ length: 300 }, (_, index) => ({
      email: `user${index + 20}@example.com`,
      password: `password${index + 1}`,
    }));

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`${insertedUsers.length} users inserted successfully.`);
  } catch (error) {
    console.error('Error inserting users:', error.message);
  }
}

module.exports = {
  insertUsers,
};
