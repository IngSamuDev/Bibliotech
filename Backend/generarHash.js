const bcrypt = require('bcryptjs');

async function main() {
    const hash = await bcrypt.hash('admin1234', 10);
    console.log('Hash generado:', hash);
}

main();