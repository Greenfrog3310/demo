<template>
    <div>
      <input type="file" @change="onFileChange" />
      <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" />
      <router-link to="/gallery">Go to Gallery</router-link>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imageUrl: null
      };
    },
    methods: {
      async onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.imageUrl = URL.createObjectURL(file);
          await this.uploadFile(file);
        }
      },
      async uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const result = await response.text();
          console.log(result);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };
  </script>