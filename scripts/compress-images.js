#!/usr/bin/env node

/**
 * Image Compression Script
 * 
 * This script compresses all images in the /public directory
 * to reduce build memory usage on Vercel.
 * 
 * Usage:
 *   1. npm install sharp --save-dev
 *   2. node scripts/compress-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];
const QUALITY = 75; // Adjust quality (1-100, higher = better quality but larger size)
const MAX_WIDTH = 1920; // Maximum width in pixels

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let filesProcessed = 0;

/**
 * Get all image files recursively from a directory
 */
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Compress a single image file
 */
async function compressImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const originalSize = fs.statSync(filePath).size;
    
    // Create backup
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Load image
    let image = sharp(filePath);
    const metadata = await image.metadata();

    // Resize if too large
    if (metadata.width > MAX_WIDTH) {
      image = image.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Compress based on format
    if (ext === '.jpg' || ext === '.jpeg') {
      image = image.jpeg({ 
        quality: QUALITY,
        progressive: true,
        mozjpeg: true 
      });
    } else if (ext === '.png') {
      image = image.png({ 
        quality: QUALITY,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    } else if (ext === '.webp') {
      image = image.webp({ 
        quality: QUALITY,
        effort: 6 
      });
    }

    // Save compressed image to temp file
    const tempPath = filePath + '.tmp';
    await image.toFile(tempPath);

    const compressedSize = fs.statSync(tempPath).size;

    // Only replace if compressed version is smaller
    if (compressedSize < originalSize) {
      fs.renameSync(tempPath, filePath);
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;
      
      const savedBytes = originalSize - compressedSize;
      const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
      
      console.log(`✓ ${path.relative(PUBLIC_DIR, filePath)}: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (saved ${savedPercent}%)`);
    } else {
      fs.unlinkSync(tempPath);
      console.log(`⊘ ${path.relative(PUBLIC_DIR, filePath)}: Already optimized`);
    }

    filesProcessed++;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Compression Tool\n');
  console.log(`Directory: ${PUBLIC_DIR}`);
  console.log(`Quality: ${QUALITY}%`);
  console.log(`Max Width: ${MAX_WIDTH}px\n`);

  // Check if sharp is installed
  try {
    require('sharp');
  } catch (error) {
    console.error('❌ Error: sharp is not installed.');
    console.error('Run: npm install sharp --save-dev\n');
    process.exit(1);
  }

  // Get all images
  console.log('📁 Finding images...\n');
  const images = getImageFiles(PUBLIC_DIR);
  console.log(`Found ${images.length} images\n`);

  if (images.length === 0) {
    console.log('No images found to compress.');
    return;
  }

  // Process images in batches to avoid memory issues
  const BATCH_SIZE = 10;
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, Math.min(i + BATCH_SIZE, images.length));
    await Promise.all(batch.map(img => compressImage(img)));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Compression Summary');
  console.log('='.repeat(60));
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`Compressed size: ${formatBytes(totalCompressedSize)}`);
  console.log(`Total saved: ${formatBytes(totalOriginalSize - totalCompressedSize)} (${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%)`);
  console.log('\n✅ Done! Backups saved with .backup extension');
  console.log('💡 Tip: Delete .backup files after verifying compression quality');
}

main().catch(console.error);