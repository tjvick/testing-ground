// make photo-display component available
require('./components/photo-display.js');

const functionURL = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '/.netlify/functions';

function isBlank(property) {
  return (
    property === undefined ||
    property === '' ||
    property === ['']
  );
}

const showGroupName = group => !isBlank(group.groupName);
const showLocation = person => !isBlank(person.location);
const showPhotos = group => !isBlank(group.imageUrls);

const appData = {
  clubData: [],
  checked: true,
};

const app = new Vue({
  delimiters: ['${', '}'],
  el: '#vue-app',
  data: appData,
  methods: {
    showGroupName,
    showLocation,
    showPhotos,
  },
});


fetch(`${functionURL}/getDataGrouped`, {
  method: 'GET',
})
.then(res => res.json())
.then((res) => {
  appData.clubData = res;
})
.catch(error => console.log('Error:', error));
