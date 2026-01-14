import db from "./models/db.js";
await db.raw(`
  SELECT setval(
    pg_get_serial_sequence('achievements', 'id'), 
    coalesce(max(id), 0) + 1, 
    false
  ) FROM achievements;
`);