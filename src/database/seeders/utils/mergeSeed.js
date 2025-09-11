/**
 * Helper untuk seeding data di Oracle dengan MERGE (upsert).
 * Bisa dipakai berulang kali di semua seeder.
 *
 * @param {object} queryInterface - dari Sequelize migration/seeder
 * @param {string} table - nama tabel (harus lowercase sesuai Oracle schema)
 * @param {Array} rows - array object data
 * @param {string} key - primary key (default: 'id')
 */
module.exports = async function mergeSeed(queryInterface, table, rows, key = 'id') {
  for (const row of rows) {
    // Escape tanda kutip tunggal biar aman di Oracle
    const safeRow = Object.fromEntries(
      Object.entries(row).map(([k, v]) => {
        if (typeof v === 'string') {
          return [k, v.replace(/'/g, "''")]; // O'Connor -> O''Connor
        }
        return [k, v];
      })
    );

    // Build SELECT part
    const selectParts = Object.entries(safeRow)
      .map(([k, v]) => (typeof v === 'string' ? `'${v}' AS "${k}"` : `${v} AS "${k}"`))
      .join(', ');

    // Build UPDATE part (kecuali primary key)
    const updateParts = Object.keys(safeRow)
      .filter((k) => k !== key)
      .map((k) => `t."${k}" = src."${k}"`)
      .join(', ');

    // Build INSERT part
    const columns = Object.keys(safeRow).concat(['created_at', 'updated_at']);
    const values = Object.keys(safeRow)
      .map((k) => `src."${k}"`)
      .concat(['SYSDATE', 'SYSDATE']);

    // Final SQL
    const sql = `
      MERGE INTO "${table}" t
      USING (SELECT ${selectParts} FROM dual) src
      ON (t."${key}" = src."${key}")
      WHEN MATCHED THEN
        UPDATE SET ${updateParts}, t."updated_at" = SYSDATE
      WHEN NOT MATCHED THEN
        INSERT (${columns.map((c) => `"${c}"`).join(', ')})
        VALUES (${values.join(', ')})
    `;

    await queryInterface.sequelize.query(sql);
  }
};
