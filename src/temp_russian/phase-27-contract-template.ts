import { QueryInterface, DataTypes } from 'sequelize';

export const phase = '27';
export const name = 'Sales Contracts — Contract Format & Russian Bank Details';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const tableDesc = await queryInterface.describeTable('sales_contracts').catch(() => null);
  if (!tableDesc) {
    console.log('⚠️  Phase 27 — sales_contracts table not found, skipping.');
    return;
  }

  // Add contract_format column (template identifier)
  if (!tableDesc['contract_format']) {
    await queryInterface.addColumn('sales_contracts', 'contract_format', {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'STANDARD',
    });
  }

  // Add russian_bank_details JSONB column
  if (!tableDesc['russian_bank_details']) {
    await queryInterface.addColumn('sales_contracts', 'russian_bank_details', {
      type: DataTypes.JSONB,
      allowNull: true,
    });
  }

  // Index for fast querying by template type
  await queryInterface
    .addIndex('sales_contracts', ['contract_format'], {
      name: 'sales_contracts_contract_format_idx',
    })
    .catch(() => {}); // Ignore if already exists

  console.log('✅ Phase 27 — contract_format & russian_bank_details columns added to sales_contracts');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface
    .removeIndex('sales_contracts', 'sales_contracts_contract_format_idx')
    .catch(() => {});

  await queryInterface
    .removeColumn('sales_contracts', 'russian_bank_details')
    .catch(() => {});

  await queryInterface
    .removeColumn('sales_contracts', 'contract_format')
    .catch(() => {});

  console.log('✅ Phase 27 — Rolled back contract_format & russian_bank_details');
}
