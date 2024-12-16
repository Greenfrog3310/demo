<template>
    <div>
      <canvas ref="qrcode"></canvas>
    </div>
  </template>
  
  <script>
  import QRCode from 'qrcode'
  
  export default {
    props: ['data'],
    mounted() {
      this.generateQRCode();
    },
    methods: {
      generateQRCode() {
        QRCode.toCanvas(this.$refs.qrcode, this.data, function (error) {
          if (error) console.error(error)
        })
      }
    }
  }
  </script>
  