<template>
  <div>
    <input type="file" @change="onFileChange" />
    <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="uploaded-image" style="max-width: 300px; max-height: 300px;" />
    <button @click="uploadFile" :disabled="!selectedFile">Upload</button>
    <button @click="goToGallery">Go to Gallery</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: null,
      selectedFile: null
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
        this.selectedFile = file;
      }
    },
    async uploadFile() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append("file", this.selectedFile);

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
    },
    goToGallery() {
      window.location.href = "/gallery";
    }
  }
};
</script>

<style scoped>
.uploaded-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px 0;
}
button {
  margin: 10px;
}
</style>