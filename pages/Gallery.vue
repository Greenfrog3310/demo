<template>
  <div>
    <h1>Uploaded Images</h1>
    <div v-if="images.length">
      <div v-for="image in images" :key="image.name">
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