// runner.js
require('dotenv').config();

const monitorLiquidity = require('./backend/scripts/liquidityWatch');
const notify = require('./backend/utils/telegram');
const log = require('./backend/utils/logger');

(async () => {
  try {
    log('🚀 Runner başlatıldı. Likidite izleniyor...');
    await monitorLiquidity();
    log('✅ Likidite kontrolü tamamlandı.');
  } catch (err) {
    const errorMsg = `❌ Hata oluştu: ${err.message}`;
    log(errorMsg);
    await notify(errorMsg);
  }
})();