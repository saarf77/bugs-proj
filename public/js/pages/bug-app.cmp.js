'use strict'
import { bugService } from '../services/bug-service.js'
import {eventBus} from '../services/eventBus-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
  <section class="bug-app">
      <div class="subheader">
        <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
        <router-link to="/bug/edit">Add New Bug</router-link> ||
        <button type="button" @click="onDownloadPDF">Download bugs pdf</button>
      </div>
      <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
      <div class="pagination">
        <button @click="goPage(-1)">Previus</button>
        <label>
        Current page: {{filterBy.page +1 }} ||
          Total Pages: {{ totalPages }} ||
          Items per page:
          <select @change="loadBugs" v-model="filterBy.itemsPerPage">
            <option>3</option>
            <option>5</option>
            <option>8</option>
          </select>
        </label>
        <button @click="goPage(1)">Next</button>
      </div>
  </section>
  `,
  data() {
      return {
          bugs: null,
          filterBy: {
              title: '',
              page: 0,
              itemsPerPage: 3,
          },
          totalPages: 0,
        //   isAdmin: false,
      };
  },
  created() {
      this.loadBugs();
  },
  methods: {
      goPage(diff) {
          this.filterBy.page += diff;
          if (this.filterBy.page > this.totalPages - 1)
              this.filterBy.page = 0;
          else if (this.filterBy.page < 0)
              this.filterBy.page = this.totalPages - 1;
          this.loadBugs();
      },
      loadBugs() {
          bugService.query(this.filterBy).then(({ bugs, totalPages }) => {
              this.bugs = bugs;
              this.totalPages = totalPages;
          });
      },
      setFilterBy(filterBy) {
          this.filterBy = {
              ...this.filterBy,
              ...filterBy, // just title is change in this.filterBy
          };
          this.loadBugs()
      },
      removeBug(bugId) {
          bugService.remove(bugId).then(() => {
              eventBus.emit('show-msg', {
                  txt: 'Bug removed!',
                  type: 'success',
              });
              this.loadBugs();
          });
      },
      onDownloadPDF() {
          bugService.downloadPDF().then(() => {
              eventBus.emit('show-msg', {
                  txt: 'Bugs PDF is Ready!',
                  type: 'success',
              });
          });
      },
  },
  components: {
      bugList,
      bugFilter,
  },
};
