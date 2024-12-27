<template>
  <div>
    <h1>Uploaded Images</h1>
    <div v-if="images.length" class="image-grid">
      <div v-for="image in images" :key="image.name" class="image-item">
        <img :src="image.url" :alt="image.name" />
      </div>
    </div>
    <div v-else>
      <p>No images uploaded yet.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: []
    };
  },
  async created() {
    await this.fetchImages();
  },
  methods: {
    async fetchImages() {
      try {
        const response = await fetch("/api/images");
        const result = await response.json();
        this.images = result;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }
  }
};
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.image-item img {
  width: 100%;
  height: auto;
  display: block;
}
</style>