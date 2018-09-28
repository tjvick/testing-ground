const app = new Vue({
  el: '#app',
  data() {
    return {
      images: [
        {
          id: '0',
          big: '/media/image1-2000px.jpg',
        },
        {
          id: '1',
          big: '/media/image2-2000px.jpg',
        },
        {
          id: '2',
          big: '/media/image3-2000px.jpg',
        },
        {
          id: '3',
          big: '/media/image4-2000px.jpg',
        },
      ],
      activeImage: 0,
    };
  },
  computed: {
    currentImage() {
      return this.images[this.activeImage].big;
    },
    nImages() {
      return this.images.length;
    },
  },
  methods: {
    next() {
      console.log('next');
      let active = this.activeImage + 1;
      if (active >= this.images.length) {
        active = 0;
      }
      this.activateImage(active);
    },
    prev() {
      let active = this.activeImage - 1;
      if (active < 0) {
        active = this.images.length - 1;
      }
      this.activateImage(active);
    },
    activateImage(imageIndex) {
      const x = (100 * imageIndex) / this.nImages;
      this.$refs.frame.style.transform = `translate3d(-${x}%, 0, 0)`;
      this.activeImage = imageIndex;
    },
    isActive(imageIndex) {
      return imageIndex === this.activeImage;
    }
  }
});
