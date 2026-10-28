import { initDatabase } from '../config/database.js';
import { Organization, Branch, AcademicYear, ClassModel, Section } from '../models/index.js';

export async function runSeeds() {
  initDatabase();
  console.log('[Sutando Seeds] Seeding initial School ERP data...');

  // 1. Organization
  let org = await Organization.query().first();
  if (!org) {
    org = await Organization.query().create({
      organization_name: 'Vidya Mandir Educational Trust',
      code: 'VMET',
      contact_email: 'admin@vidyamandir.edu',
      contact_phone: '+91 98765 43210',
    });
    console.log('✓ Seeded Organization:', org.organization_name);
  }

  // 2. Branches
  const existingBranches = await Branch.query().where('organization_id', org.id).count();
  if (existingBranches === 0) {
    const branchesData = [
      {
        organization_id: org.id,
        branch_name: 'Main Campus',
        branch_code: 'MC001',
        short_name: 'Main',
        branch_type: 'Main Branch',
        status: 'Active',
        address_line_1: '100 School Road',
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        city: 'Coimbatore',
        pincode: '641001',
        board: 'CBSE',
      },
      {
        organization_id: org.id,
        branch_name: 'Peelamedu Branch',
        branch_code: 'PL002',
        short_name: 'Peelamedu',
        branch_type: 'Branch',
        status: 'Active',
        address_line_1: '45 Avinashi Road',
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        city: 'Coimbatore',
        pincode: '641004',
        board: 'ICSE',
      }
    ];

    for (const b of branchesData) {
      await Branch.query().create(b);
    }
    console.log('✓ Seeded initial Branches');
  }

  console.log('[Sutando Seeds] Seeding completed!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Sutando Seeds] Error running seeds:', err);
      process.exit(1);
    });
}
