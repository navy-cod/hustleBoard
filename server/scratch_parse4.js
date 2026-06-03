const parse = require('pg-connection-string').parse;
const connStr = 'postgresql://postgres:pass/word@Hustleboar@db.tcldjwstrpoxtcmndofx.supabase.co:5432/postgres';
console.log('Parsed config:', parse(connStr));
