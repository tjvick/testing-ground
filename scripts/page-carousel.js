require('./components/photo-display.js');

const app = new Vue({
  el: '#app',
  data() {
    return {
      imageUrls: [
        '/media/image2-2000px.jpg',
        // '/media/image1-2000px.jpg',
      ],
    };
  },
});