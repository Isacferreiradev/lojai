const fs = require('fs');
let s = fs.readFileSync('prisma/seed.ts', 'utf8');
s = s.replace(/price: (\d+\.\d+)/g, (_, p) => `price: ${(parseFloat(p) * 0.5).toFixed(2)}`);
s = s.replace(/promoPrice: (\d+\.\d+)/g, (_, p) => `promoPrice: ${(parseFloat(p) * 0.5).toFixed(2)}`);
fs.writeFileSync('prisma/seed.ts', s);
console.log('Seed prices halved.');
