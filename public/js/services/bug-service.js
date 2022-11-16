const API_URL = 'http://localhost:3030/api'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  downloadPDF
}

function query(filterBy) {
  return axios.get(`${API_URL}/bug`, { params: filterBy })
    .then(({ data }) => data)
}

function getById(bugId) {
  return axios.get(`${API_URL}/bug/${bugId}`)
    .then(({ data }) => data)
}

function remove(bugId) {
  return axios.delete(`${API_URL}/bug/${bugId}`)
    .then(({ data }) => data)
}

function save(bug) {
  if (bug._id) return axios.put(`${API_URL}/bug/${bug._id}`, bug) // update bug
  else return axios.post(`${API_URL}/bug`, bug) // create bug
}

function downloadPDF(fileName = 'Bugs.pdf') {
  return axios.get(`${API_URL}/bug/download`, { responseType: 'blob' })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      link.click()
    })
}

function getEmptyBug() {
  return {
    _id: '',
    title: '',
    description: '',
    severity: 1,
    createdAt: 0
  }
}
