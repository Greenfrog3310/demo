<script setup lang="ts">
import { ref } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

const result = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const isScanning = ref(false);
let html5QrCode: Html5Qrcode | null = null;

const startScanner = async () => {
  if (html5QrCode) return;

  html5QrCode = new Html5Qrcode('reader');
  isScanning.value = true;

  try {
    const devices = await Html5Qrcode.getCameras();
    if (devices && devices.length > 0) {
      const cameraId = devices[0].id;

      await html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (decodedText) {
            result.value = decodedText;
            errorMessage.value = null;
            stopScanner();
          }
        },
        (error) => {
        //   errorMessage.value = `Scanning error: ${error}`;
        errorMessage.value = 'Scanning qr code'
        }
      );
    } else {
      errorMessage.value = 'No camera devices found';
    }
  } catch (err) {
    stopScanner();
    console.error('Error starting scanner:', err);
    errorMessage.value = 'Failed to start scanner';
  }
};

const stopScanner = async () => {
  if (html5QrCode) {
    await html5QrCode.stop();
    html5QrCode = null;
    isScanning.value = false;
  }
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    console.log('Uploaded file:', file); 
    const scanner = new Html5Qrcode('reader');
    try {
      const decodedText = await scanner.scanFile(file);
      console.log('Decoded Text:', decodedText);
      result.value = decodedText;
      errorMessage.value = null;
    } catch (err) {
      console.error('Error decoding QR Code:', err);
      errorMessage.value = 'Failed to decode QR Code from file.';
    }
  } else {
    console.error('No file selected');
  }
};
</script>

<template>
  <div class="p-5">
    <h1 class="text-lg font-bold mb-4">QR Code Scanner</h1>
    
    <div class="mb-4">
      <button 
        v-if="!isScanning" 
        @click="startScanner" 
        class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Start Camera Scanner
      </button>
      <button 
        v-if="isScanning" 
        @click="stopScanner" 
        class="bg-red-500 text-white px-4 py-2 rounded mr-2">
        Stop Camera Scanner
      </button>
      <label 
        class="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
        Upload Image
        <input type="file" accept="image/*" @change="handleFileUpload" hidden />
      </label>
    </div>

    <div id="reader" class="mb-4" style="width: 300px; height: 300px; border: 1px solid #ddd;"></div>

    <div v-if="result" class="mt-4">
      <h2 class="text-green-500 font-bold text-wrap">Result:</h2>
      <p>{{ result }}</p>
    </div>

    <div v-if="errorMessage" class="mt-4 text-red-500">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>