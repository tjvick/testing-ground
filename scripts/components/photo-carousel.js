Vue.component('photo-carousel', {
  template: `
    <div class="c-carousel">
      <div class="c-carousel__frame u-relative">
        <div class="u-absolute-fill">
          <div class="c-carousel__strip" v-bind:style="stripStyle" ref="strip">
            <div v-for="(imageUrl, index) in imageUrls" class="c-carousel__image-container" v-bind:style="containerStyle">
              <img class="c-carousel__image" v-bind:src="imageUrl" alt="">
            </div>
          </div>
          <div class="c-carousel__changer">
            <span class="c-carousel__change-btn c-carousel__change-btn--prev" v-on:click="prev">
              <i class="fas fa-chevron-left"></i>
            </span>
            <span class="c-carousel__change-btn c-carousel__change-btn--next" v-on:click="next">
              <i class="fas fa-chevron-right"></i>
            </span>
          </div>
          <div class="c-carousel__count-indicator">
            <div class="c-indicator-bullet" v-for="(imageUrl, index) in imageUrls" @click="activateImage(index)">
              <span v-if="!isActive(index)">&#9898;</span>
              <span v-if="isActive(index)">&#9899;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      activeImage: 0,
    };
  },
  computed: {
    nImages() {
      return this.imageUrls.length;
    },
    stripStyle() {
      return {
        width: `${100 * this.nImages}%`,
      };
    },
    containerStyle() {
      return {
        width: `${100 / this.nImages}%`
      }
    }
  },
  methods: {
    next() {
      let active = this.activeImage + 1;
      if (active >= this.nImages) {
        active = 0;
      }
      this.activateImage(active);
    },
    prev() {
      let active = this.activeImage - 1;
      if (active < 0) {
        active = this.nImages - 1;
      }
      this.activateImage(active);
    },
    activateImage(imageIndex) {
      const x = (100 * imageIndex) / this.nImages;
      this.$refs.strip.style.transform = `translate3d(-${x}%, 0, 0)`;
      this.activeImage = imageIndex;
    },
    isActive(imageIndex) {
      return imageIndex === this.activeImage;
    },
  },
  props: ['imageUrls'],
});