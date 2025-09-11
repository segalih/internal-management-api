'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = [
      { id: 1, group_id: 1, name: 'Financing & Collection Services' },
      { id: 2, group_id: 1, name: 'Release' },
      { id: 3, group_id: 1, name: 'Core2' },
    ];

    for (const dept of departments) {
      await queryInterface.sequelize.query(`
        MERGE INTO "master_departments" t
        USING (SELECT ${dept.id} AS "id", ${dept.group_id} AS "group_id", '${dept.name}' AS "name" FROM dual) s
        ON (t."id" = s."id")
        WHEN MATCHED THEN
          UPDATE SET 
            t."group_id" = s."group_id",
            t."name" = s."name",
            t."updated_at" = SYSDATE
        WHEN NOT MATCHED THEN
          INSERT ("id", "group_id", "name", "created_at", "updated_at")
          VALUES (s."id", s."group_id", s."name", SYSDATE, SYSDATE)
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_departments', {
      id: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
