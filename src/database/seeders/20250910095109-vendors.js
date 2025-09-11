'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const vendors = [
      { id: 1, name: 'ADIDATA' },
      { id: 2, name: 'MITECH' },
      { id: 3, name: 'AIgen' },
    ];

    for (const v of vendors) {
      await queryInterface.sequelize.query(`
        MERGE INTO "master_vendors" t
        USING (SELECT ${v.id} AS "id", '${v.name}' AS "name" FROM dual) s
        ON (t."id" = s."id")
        WHEN MATCHED THEN
          UPDATE SET 
            t."name" = s."name",
            t."updated_at" = SYSDATE
        WHEN NOT MATCHED THEN
          INSERT ("id", "name", "created_at", "updated_at")
          VALUES (s."id", s."name", SYSDATE, SYSDATE)
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_vendors', {
      id: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
