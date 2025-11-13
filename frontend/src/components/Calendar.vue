<template>
    <div>
      <button :popovertarget="popover" class="input input-border w-min" :id="uniqueId" style="anchor-name:--dataInicial">
        Selecionar data
      </button>
      <div popover :id="popover" class="dropdown bg-base-100 rounded-box shadow-lg" style="position-anchor:--dataInicial">
        <calendar-date id="day" class="cally"  @change="myChangeMethod" :v-model="day">
          <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>
  </div>
</template>

<script>

export default {
  props: {
    day: {
      type: String
    },
    uniqueId: {
      default: 'popover'
    },
    popover:{
      default: 'popoverp'
    }
  },
  data() {
    return {
      selected: '',
    };
  },
  created() {
    this.selected = this.day;
    console.log(this.selected)
  },
  methods: {
    myChangeMethod() {
      document.getElementById(this.uniqueId).innerText = event.target.value;
      console.log(document.getElementById(this.uniqueId))
      this.$emit('input', document.getElementById(this.uniqueId).innerText);
    },

  },
  watch: {
    day() {
      this.selected = this.day;
    },
  },
};

</script>