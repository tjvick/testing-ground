const { Siema } = require('./_util/siema.js');

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

const showImg = person => !isBlank(person.imageUrl);
const showGroupName = group => !isBlank(group.groupName);
const showLocation = person => !isBlank(person.location);
const showImgGroup = group => !isBlank(group.imageUrls);

const appData = {
  clubData: [],
  checked: false,
};

const app = new Vue({
  delimiters: ['${', '}'],
  el: '#vue-app',
  data: appData,
  methods: {
    showImg,
  },
});

const app2Data = {
  clubData: [],
  checked: true,
};

const app2 = new Vue({
  delimiters: ['${', '}'],
  el: '#vue-app-2',
  data: app2Data,
  methods: {
    showGroupName,
    showLocation,
    showImgGroup,
  },
});



fetch(`${functionURL}/getData`, {
  method: 'GET',
})
.then(res => res.json())
.then(res => {
  appData.clubData = res;
})
.catch(error => console.log('Error:', error));


fetch(`${functionURL}/getDataGrouped`, {
  method: 'GET',
})
.then(res => res.json())
.then(res => {
  app2Data.clubData = res;
})
.then(res => {
  new Siema({
    selector: '.u-siema',
    loop: true,
  });
})
.catch(error => console.log('Error:', error));
