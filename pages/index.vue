<template>
  <div>
    <h1>Navigation Example</h1>
    <nav>
      <ul>
        <li><router-link to="/Gallery">Gallery</router-link></li>
        <li><router-link to="/upload">upload</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>

<style scoped>
nav ul {
  list-style-type: none;
  padding: 0;
}

nav li {
  display: inline;
  margin-right: 10px;
}
</style>