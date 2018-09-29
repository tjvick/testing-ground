// Wrapper for photo-carousel to handle single-image cases where a carousel is not necessary

require('./photo-carousel.js');

Vue.component('photo-display', {
  template: `
    <div class="c-photo-display" v-if="showAnything">
      <photo-carousel v-if="showCarousel" v-bind:image-urls="imageUrls"></photo-carousel>
      <div class="c-not-carousel">
        <div class="c-carousel__image-container" v-if="!showCarousel">
          <img class="c-carousel__image" v-bind:src="imageUrls[0]" alt="">
        </div>
      </div>
    </div>
  `,
  data() {
    return {};
  },
  computed: {
    showCarousel() {
      if (this.showAnything && this.imageUrls.length > 1) {
        return true;
      }

      return false;
    },
    showAnything() {
      if (this.imageUrls === undefined) {
        return false;
      } else if (this.imageUrls.length === 0) {
        return false;
      }

      return true;
    }
  },
  methods: {},
  props: ['imageUrls'],
});

