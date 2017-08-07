let app = new Vue({
  el: '#app'
  data: {
    message: 'hello from vue'
  },
  methods: {

  },
  computed : {

  },
  render(createElement) {
    return createElement('div', this.message)
  }
}).$mount('#app')
