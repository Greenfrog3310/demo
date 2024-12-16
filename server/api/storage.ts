import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const kv = useStorage('kv');

  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const { data, timestamp } = body;

    if (typeof data !== 'string' || typeof timestamp !== 'number') {
      return { success: false, message: 'Invalid data or timestamp' };
    }

    const lastKey = Number(await kv.getItem('lastUserKey')) || 0;
    const newKey = lastKey + 1;

    await kv.setItem('lastUserKey', newKey);
    await kv.setItem(`user-${newKey}`, { data, timestamp });

    return { success: true, key: `user-${newKey}`, message: `Data saved with key: user-${newKey}` };
  }

  if (event.req.method === 'GET') {
    const { key } = getQuery(event);
    if (key) {
      const value = await kv.getItem(String(key));
      return { key, value };
    }

    const keys = await kv.getKeys();
    const allData = await Promise.all(
      keys.filter((key) => key.startsWith('user-')) // เฉพาะคีย์ที่เกี่ยวข้องกับผู้ใช้
        .map(async (key) => ({ key, value: await kv.getItem(key) }))
    );
    return { data: allData };
  }

  return { success: false, message: 'Invalid request method' };
});