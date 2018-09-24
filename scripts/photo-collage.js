
const functionURL = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '/.netlify/functions';


function showImg(person) {
  console.log(person);
  console.log(person.imageUrl);
  console.log(person.imageUrl === undefined);
  return person.imageUrl !== undefined;
}

const appData = {
  clubData: [],
};

const app = new Vue({
  delimiters: ['${', '}'],
  el: '#vue-app',
  data: appData,
  methods: {
    showImg,
  },
})


fetch(`${functionURL}/getData`, {
  method: 'GET',
})
.then(res => res.json())
.then(res => {
  console.log(res);
  appData.clubData = res;
})
.catch(error => console.log('Error:', error));