const { seedData } = require('./seedService');

(async () => {
  try {
    await seedData();
    console.log('[Seed Runner] Seed execution completed.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Runner Error]:', err);
    process.exit(1);
  }
})();
