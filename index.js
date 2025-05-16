const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./src/routes/routeAuth');
const propertyRoutes = require('./src/routes/routeProperty');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/property', propertyRoutes);

app.get('/', (req, res) => {
  res.send('Servidor rodando com PostgreSQL e Prisma!');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
