require('dotenv').config();
import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Database Sync
    sequelize
      .sync({ alter: true }) // ganti dengan { force: true } jika butuh reset total
      .then(() => {
        console.log('Database synchronized');
        app.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT}`);
        });
      })
      .catch((err) => {
        console.error('Unable to sync database:', err);
      });
  } catch {
    (error: any) => {
      console.log(error);
    };
  }
}

main();
