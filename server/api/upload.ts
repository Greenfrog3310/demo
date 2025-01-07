import path from 'path';
import { promises as fs } from 'fs';
import exifReader from 'exif-reader';
import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default defineEventHandler(async (event, context: Context) => {
  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const file = formData.find((field) => field.name === 'file');
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const imagesDir = path.resolve('./public/images');
  const tempFilePath = path.join(imagesDir, `temp_${file.filename}`);

  // ตรวจสอบว่ามีโฟลเดอร์ images หรือไม่ ถ้าไม่มีให้สร้างใหม่
  await fs.mkdir(imagesDir, { recursive: true });

  // อ่านข้อมูล EXIF ก่อนที่จะบันทึกไฟล์
  let exifData = {};
  try {
    exifData = exifReader(file.data);
  } catch (error) {
    console.error(`Error reading EXIF data from ${file.filename}:`, error);
  }

  // เขียนไฟล์ไปยังตำแหน่งชั่วคราว
  await fs.writeFile(tempFilePath, file.data);

  // อัพเดตเวลาของไฟล์ให้ตรงกับเวลาของต้นฉบับ
  if (exifData.exif && exifData.exif.DateTimeOriginal) {
    const originalDate = new Date(exifData.exif.DateTimeOriginal * 1000);
    await fs.utimes(tempFilePath, originalDate, originalDate);
  }

  // ย้ายไฟล์จากตำแหน่งชั่วคราวไปยังตำแหน่งสุดท้าย
  const finalFilePath = path.join(imagesDir, file.filename);
  await fs.rename(tempFilePath, finalFilePath);

  // การตั้งค่าค่าใน blob store สำหรับ construction และ beauty
  const construction = getStore("construction");
  await construction.set("nails", "For general carpentry");

  const beauty = getStore("beauty");
  await beauty.set("nails", "For formal events", {
    metadata: { material: "acrylic", sale: true },
  });

  return { 
    url: `/images/${file.filename}`, 
    name: file.filename, 
    exifData,
    message: "Nail blobs set for Construction and Beauty stores"
  };
});
