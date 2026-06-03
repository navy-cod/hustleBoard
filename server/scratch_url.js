try {
  const url = new URL('postgresql://postgres:password@Hustleboar@db.tcldjwstrpoxtcmndofx.supabase.co:5432/postgres');
  console.log('URL parsed successfully:');
  console.log('username:', url.username);
  console.log('password:', url.password);
  console.log('hostname:', url.hostname);
  console.log('port:', url.port);
  console.log('pathname:', url.pathname);
} catch (e) {
  console.error('URL parse failed:', e.message);
}
