export { fetchCountries };
  
  const url = 'https://restcountries.com/v3.1/';

function fetchCountries(serch) {
  return fetch(`${url}/name/${serch}`).then(response => {
    console.log(response.ok);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}
