// src/migrations/20240502-create-orders.ts
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_orders_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      total_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: 'enum_orders_status',
        defaultValue: 'pending',
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('credit_card', 'bank_transfer', 'e_wallet', 'cod'),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('unpaid', 'paid', 'failed', 'refunded'),
        defaultValue: 'unpaid',
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS enum_orders_status;`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_orders_payment_status";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_orders_payment_method";`
    );
  },
};
