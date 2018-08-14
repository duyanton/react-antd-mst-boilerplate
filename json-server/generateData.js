const faker = require('faker');

const ADMIN_USER = {
  id: '1',
  address: '807 Harris Rapid',
  avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/martip07/128.jpg',
  email: 'admin@example.com',
  password: 'password',
  full_name: 'Admin',
  job_title: 'Developer',
  phone: '673-836-3495',
  role: 'admin',
};

module.exports = () => {
  const data = { users: [ADMIN_USER] };

  for (let i = 2; i <= 1000; i += 1) {
    data.users.push({
      id: i.toString(),
      address: faker.address.streetAddress(),
      avatar: faker.internet.avatar(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      full_name: faker.name.findName(),
      job_title: faker.name.jobTitle(),
      phone: faker.phone.phoneNumberFormat(),
      role: 'user',
    });
  }
  return data;
};
