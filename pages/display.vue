<template>
  <div>
    <h1>Stored Data</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="data.length === 0">No data found.</div>
      <ul v-else>
        <li v-for="item in data" :key="item.key">
          <strong>{{ item.key }}:</strong> {{ item.value.data }} ({{ new Date(item.value.timestamp).toLocaleString() }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      loading: true
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/storage');
      const result = await response.json();
      if (result.data) {
        this.data = result.data;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

div {
  font-family: Arial, sans-serif;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

strong {
  color: #333;
}
</style>