<template>
    <div>
      <h1>Upload Image</h1>
      <input type="file" accept="image/*" @change="onFileChange" />
      <button @click="uploadFile">Upload</button>
      <div v-if="message" :class="{'success': isSuccess, 'error': !isSuccess}">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    data() {
      return {
        selectedFile: null as File | null,
        message: '',
        isSuccess: false
      };
    },
    methods: {
      onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          this.selectedFile = target.files[0];
        }
      },
      async uploadFile() {
        if (!this.selectedFile) {
          alert('Please select an image first!');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', this.selectedFile);
  
        try {
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.status === 200) {
            this.message = 'Image uploaded successfully!';
            this.isSuccess = true;
          } else {
            this.message = `Error uploading image: ${response.statusText}`;  // แก้ไขตรงนี้
            this.isSuccess = false;
          }
        } catch (error) {
          this.message = `Error uploading image: ${error.message}`;  // แก้ไขตรงนี้
          this.isSuccess = false;
        }
      }
    }
  });
  </script>
  
  <style scoped>
  .success {
    color: green;
  }
  .error {
    color: red;
  }
  </style>
  