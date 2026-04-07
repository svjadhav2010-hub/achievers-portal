const bcrypt = require('bcrypt');

async function generateHash() {
  // Replace this with your new desired admin password
  const plainTextPassword = 'Swayam@2005'; 
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  
  console.log('Your new hash is:');
  console.log(hashedPassword);
}

generateHash();