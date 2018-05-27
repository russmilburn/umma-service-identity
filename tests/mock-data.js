let encryptedUserData = {
  username: 'russell@livingsoup.co.uk',
  password: 'password',
  firstName: 'russell',
  lastName: 'milburn'
};

let userData = [{
  username: 'russell@livingsoup.co.uk',
  password: 'password',
  firstName: 'russell',
  lastName: 'milburn'
},
  {
    username: 'user@gmail.com',
    password: 'helloword',
    firstName: 'user',
    lastName: 'user'
  },
  {
    firstName: 'blah',
    lastName: 'blah'
  }
];

module.exports.encryptedUserData = encryptedUserData;
module.exports.userData = userData;