const { withDbConnection, dropIfExists } = require('../lib/withDbConnection');
const { hashPassword } = require('../lib/hashing');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');
const Company = require('../models/Company');
const Subscription = require('../models/Subscription');
const Chat = require('../models/Chat');
const Extra = require('../models/Extra');
const Plan = require('../models/Plan');

const names = [
  'Ana María',
  'Isabel',
  'María Pilar',
  'María Dolores',
  'María Teresa',
  'Laura',
  'Ana',
  'Cristina',
  'María Ángeles',
  'Francisca',
  'Marta',
  'Antonia',
  'Dolores',
  'María Isabel',
  'María José',
  'Lucia',
  'María Luisa',
  'Sara',
  'Paula',
  'Elena',
  'Pilar',
  'Concepción',
  'Raquel',
  'Rosa María',
  'Manuela',
  'Mercedes',
  'Antonio',
  'Jose',
  'Francisco',
  'Juan',
  'Manuel',
  'Pedro',
  'Jesús',
  'Angel',
  'Miguel',
  'Javier',
  'David',
  'Jose Antonio',
  'Carlos',
  'Alejandro',
  'Jose Luis',
  'Miguel Angel',
  'Francisco Javier',
  'Rafael',
  'Daniel',
  'Pablo',
  'Sergio',
  'Juan Jose',
  'Luis',
  'Juan Antonio',
  'Joaquin',
  'Fernando',
  'Juan Carlos',
  'Andrés',
  'Jose Manuel',
  'Jose María',
  'Alvaro',
  'Ramon',
  'Raul',
  'Albert',
  'Enrique',
  'Francisco Jose',
  'Diego',
  'Jorge',
  'Vicente',
];

const surnames = [
  'Garcia',
  'Herrera',
  'Gomez',
  'Martínez',
  'Hernandez',
  'Alvarez',
  'Barbosa',
  'Colina',
  'Dorta',
  'Aguiar',
];

withDbConnection(async () => {
  await dropIfExists(Company);
  await dropIfExists(ClientUser);
  await dropIfExists(LocalUser);
  await dropIfExists(Chat);
  await dropIfExists(Plan);
  await dropIfExists(Extra);
  await dropIfExists(Subscription);

  const newCompany = await Company.create({
    name: 'IronHack',
  });
  const admin = await LocalUser.create({
    username: 'luism.feijoo26@gmail.com',
    password: hashPassword('luis12345.'),
    name: {
      first: 'Luis',
      last: 'Feijoo',
    },
    type: 'admin',
    company: newCompany._id,
  });

  const clients = new Array(50).fill(0).map((client, i) => {
    return {
      username: `${i}@gmail.com`,
      password: hashPassword('luis12345.'),
      name: {
        first: `${names[i]}`,
        last: `${surnames[i % 10]}`,
      },
      phone: { prefix: '+34', phone: '644040404' },
      company: newCompany._id,
    };
  });

  await ClientUser.create(clients);
});
