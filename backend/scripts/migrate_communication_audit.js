import { initDatabase, sutando } from '../config/database.js';

async function migrate() {
  initDatabase();
  const knex = sutando.connection();
  
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS communication_audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT NOT NULL,
      academic_year_id INT NULL,
      module_name VARCHAR(50) NOT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT NULL,
      user_id INT NULL DEFAULT 1,
      ip_address VARCHAR(45) NULL DEFAULT '127.0.0.1',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_branch_ay (branch_id, academic_year_id),
      INDEX idx_module (module_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('communication_audit_logs created successfully!');

  // Check if logs exist, if empty seed from existing communications
  const [existingLogs] = await knex.raw('SELECT COUNT(*) as cnt FROM communication_audit_logs');
  if (existingLogs[0].cnt === 0) {
    console.log('Seeding initial audit logs from existing communication records...');
    
    // 1. Seed from homework
    const [hwRows] = await knex.raw('SELECT id, branch_id, title, subject_name, created_at FROM homework LIMIT 50');
    for (const h of hwRows) {
      await knex.raw(
        'INSERT INTO communication_audit_logs (branch_id, module_name, action, details, user_id, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [h.branch_id || 1, 'Homework', 'Created Homework', `Posted daily homework for '${h.subject_name || 'Subject'}' - '${h.title || 'Homework'}'`, 1, '127.0.0.1', h.created_at || new Date()]
      );
    }

    // 2. Seed from assignments
    const [assignRows] = await knex.raw('SELECT id, branch_id, academic_year_id, title, subject_name, created_at FROM assignments LIMIT 50');
    for (const a of assignRows) {
      await knex.raw(
        'INSERT INTO communication_audit_logs (branch_id, academic_year_id, module_name, action, details, user_id, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [a.branch_id || 1, a.academic_year_id || 2, 'Assignment', 'Created Assignment', `Assigned '${a.title || 'Assignment'}' in '${a.subject_name || 'Subject'}'`, 1, '127.0.0.1', a.created_at || new Date()]
      );
    }

    // 3. Seed from announcements
    const [annRows] = await knex.raw('SELECT id, branch_id, academic_year_id, title, user_type, created_at FROM announcements LIMIT 50');
    for (const an of annRows) {
      await knex.raw(
        'INSERT INTO communication_audit_logs (branch_id, academic_year_id, module_name, action, details, user_id, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [an.branch_id || 1, an.academic_year_id || 2, 'Announcement', 'Broadcast Notice', `Published circular '${an.title || 'Notice'}' to ${an.user_type || 'Students & Parents'}`, 1, '127.0.0.1', an.created_at || new Date()]
      );
    }

    // 4. Seed from gallery
    const [galRows] = await knex.raw('SELECT id, branch_id, academic_year_id, album_name, event_name, created_at FROM gallery_albums LIMIT 50');
    for (const g of galRows) {
      await knex.raw(
        'INSERT INTO communication_audit_logs (branch_id, academic_year_id, module_name, action, details, user_id, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [g.branch_id || 1, g.academic_year_id || 2, 'Gallery', 'Created Event Album', `Created photo album for event '${g.event_name || 'Event'}' - '${g.album_name || 'Album'}'`, 1, '127.0.0.1', g.created_at || new Date()]
      );
    }

    console.log('Initial audit logs seeded successfully!');
  }

  process.exit(0);
}

migrate().catch(e => {
  console.error('Migration error:', e);
  process.exit(1);
});
