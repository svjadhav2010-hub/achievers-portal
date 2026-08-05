const bcrypt = require('bcrypt');

async function generateHash() {
  // Replace this with your new desired admin password
  const plainTextPassword = 'admin@123'; 
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  
  console.log('Your new hash is:');
  console.log(hashedPassword);
}

generateHash();