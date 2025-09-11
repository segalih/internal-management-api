'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const groups = [
      { id: 1, name: 'ASP' },
      { id: 2, name: 'IDG' },
      { id: 3, name: 'IOG' },
    ];

    for (const group of groups) {
      await queryInterface.sequelize.query(`
  MERGE INTO "master_groups" t
  USING (SELECT ${group.id} AS "id", '${group.name}' AS "name" FROM dual) s
  ON (t."id" = s."id")
  WHEN MATCHED THEN
    UPDATE SET t."name" = s."name", t."updated_at" = SYSDATE
  WHEN NOT MATCHED THEN
    INSERT ("id", "name", "created_at", "updated_at")
    VALUES (s."id", s."name", SYSDATE, SYSDATE)
`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MASTER_GROUPS', {
      ID: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
