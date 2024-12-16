<template>
  <div>
    <h1>Generate QR Code</h1>
    <input v-model="text" placeholder="Enter text">
    <button @click="generateQRCode">Generate</button>
    <QRCodeComponent v-if="qrCodeData" :data="qrCodeData" />
    <div v-if="qrCodeData">
      <p>QR Code URL: <a :href="qrCodeData" target="_blank">{{ qrCodeData }}</a></p>
      <router-link :to="{ path: '/scan', query: { data: text } }">Go to Scan Page</router-link>
    </div>
  </div>
</template>

<script>
import QRCodeComponent from '~/components/QRCodeComponent.vue'

export default {
  components: {
    QRCodeComponent
  },
  data() {
    return {
      text: '',
      qrCodeData: null
    }
  },
  methods: {
    generateQRCode() {
      if (this.text) {
        const encodedText = encodeURIComponent(this.text);
        this.qrCodeData = `http://localhost:3000/scan?data=${encodedText}`;      
        }
    }
  }
}
</script>
