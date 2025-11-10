<template>
    <div>
      <button popovertarget="cally-popover1" class="input input-border w-min" id="dataInicial" style="anchor-name:--dataInicial">
        Selecionar data
      </button>
      <div popover id="cally-popover1" class="dropdown bg-base-100 rounded-box shadow-lg" style="position-anchor:--dataInicial">
        <calendar-date id="day" class="cally" onchange="{document.getElementById('dataInicial').innerText = this.value}" @change="myChangeMethod" :v-model="day">
          <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>
  </div>
</template>

<script>

// const props = defineProps({
//   day: {
//         type: String,
//         required: true
//       },
// })

// Source - https://stackoverflow.com/a
// Posted by Brandon Deo, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-09, License - CC BY-SA 3.0

// Source - https://stackoverflow.com/a
// Posted by anon, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-09, License - CC BY-SA 3.0

export default {
  props: {
    day: {
      required: true,
    }
  },
  data() {
    return {
      selected: '',
    };
  },
  created() {
    this.selected = this.day;
  },
  methods: {
    // This would be fired on change of your dropdown.
    // You'll have to pass the `option` as a param here,
    // So that you can send  that data back somehow
    myChangeMethod() {
      this.$emit('input', document.getElementById('dataInicial').innerText);
    },
  },
  watch: {
    day() {
      this.selected = this.day;
    },
  },
};

</script>