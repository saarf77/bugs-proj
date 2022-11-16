'use strict'

import bugPreview from './bug-preview.cmp.js'

export default {
  props: ['bugs'],
  template: `
    <section v-if="bugs.length" className="bug-list">
             
      <bug-preview v-for="bug in bugs" :key="bug._id"
        :bug="bug"
        @removeBug="bugId => $emit('removeBug', bugId)"
      />

    </section>
    <section v-else class="bug-list">Yay! No Bugs!</section>
    `,
  methods: {},
  components: {
    bugPreview,
  },
}
