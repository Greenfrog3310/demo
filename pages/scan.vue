<template>
  <div>
    <h1>Scan QR Code</h1>
    <input v-model="scannedData" placeholder="Scan QR Code">
    <button @click="submitData">Submit</button>
    <div v-if="savedKey">Data saved with key: {{ savedKey }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scannedData: this.$route.query.data || '',
      savedKey: null
    }
  },
  methods: {
    async submitData() {
      if (this.scannedData) {
        const timestamp = Date.now(); // ใช้ timestamp เป็นตัวเลข
        const result = await saveDataToKVStorage({ data: this.scannedData, timestamp });
        if (result.success) {
          this.savedKey = result.key;
          alert('Data submitted!');
        } else {
          alert('Error submitting data');
        }
      }
    }
  }
}

async function saveDataToKVStorage(data) {
  try {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false };
  }
}
</script>