'use strict'

import { bugService } from '../services/bug-service.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{ bug.title }}</h1>
        <p>Description: {{ bug.description }}</p>
        <p>Created At: {{ getBugDate }}</p>
        <span :class='"severity" + bug.severity'>Severity: {{ bug.severity }}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  computed: {
    getBugDate() {
      return new Date(this.bug.createdAt).toString().split(' ')[4]
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId)
        .then(bug => this.bug = bug)
        .catch(({ response }) => {
          eventBus.emit('show-msg', {
            txt: response.data,
            type: 'error'
          })
          this.$router.push('/bug')
        })
    }
  },
}
