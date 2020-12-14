/* eslint-disable no-new */
import 'regenerator-runtime/runtime';
import Autocomplete from './Autocomplete';

import usStates from './us-states';
import './main.css';



// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation,
}));

async function getResults(query, data) {
  if (!query) return [];
  // Filter for matching strings
  return data.filter((item) => {
    return item.text.toLowerCase().includes(query.toLowerCase());
  });
}

new Autocomplete(document.getElementById('state'), {
  data,
  onChange: getResults,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});



async function showUsers(query) {
  const url = `https://api.github.com/search/users?q=${query}&per_page=10`;
  const response = await fetch(url);
  const gitData = await response.json()
  const users = gitData.items.map(user=>({
    text: user.login,
    value: user.url
  }));
  
  return users;
}

new Autocomplete(document.getElementById('gh-user'), {
  onChange: showUsers,
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  }
});




