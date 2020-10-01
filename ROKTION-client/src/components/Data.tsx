import React from 'react';

function api<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      console.log(response.body);
      return response.json() as Promise<T>
    })
}
 
function Data() {
  api<{ lastname: string; firstname: string }>('/data')
  .then(({ lastname, firstname }) => {
    console.log(lastname, firstname);
  })
  .catch(error => {
    console.error(error);
  })
 
  return (
    <p>hello world!</p>
  );
}
 
export default Data;
