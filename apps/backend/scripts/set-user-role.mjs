import dataSource from '../dist/database/data-source.js';
import { User } from '../dist/users/user.entity.js';

const [id, role] = process.argv.slice(2);
if (!id || !['user', 'admin'].includes(role) || process.argv.length !== 4) {
  console.error('Aufruf: npm run user:role -- <Google-ID> <user|admin>');
  process.exitCode = 1;
} else {
  try {
    await dataSource.initialize();
    const users = dataSource.getRepository(User);
    const user = await users.findOneBy({ id });
    if (!user)
      throw new Error('Benutzer nicht gefunden. Zuerst mit Google anmelden.');
    await users.update({ id }, { role });
    console.log(`Rolle auf ${role} gesetzt.`);
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'Rolle konnte nicht gesetzt werden.',
    );
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}
