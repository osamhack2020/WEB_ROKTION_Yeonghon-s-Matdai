import React from 'react';

interface DataState {
  outputData: string,
  id: string
}

interface DataProps {

}
 
class Data extends React.Component<DataProps, DataState> {
  
  api<T>(url: string, option: Object): Promise<T> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        console.log(response.body);
        return response.json() as Promise<T>
      })
  }

  constructor(props: DataProps) {
    super(props);

    this.state = {
      outputData: '',
      id: ''
    }
  };

  getData(id: string) {
    this.api<{name: string}>(`/data/${id}`, {
      method: 'GET'
    }).then(({name}) => {
      this.setState({ outputData: `${this.state.outputData}, ${name} `});
    })
    .catch(err => {
      console.error(err);
    });
  };

  clickedPost() {
    fetch('/data', {
      method: 'POST',
      body: JSON.stringify({
        name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        tagId: Math.floor(Math.random() * 10000000) + 1,
        permission: false,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log(res.status);
    })
    .catch(err => {
      console.error(err);
    }) 
  }

  render() {
    return (
      <div>
        <p>Hello {this.state.outputData}</p>
        <button onClick={this.clickedPost}>Click to POST</button>
        <input
          value={this.state.id}
          onChange={
            (e) => this.setState({ id: e.target.value })
          }
        />
        <button onClick={() => this.getData(this.state.id)}>Click to GET</button>
      </div>
    );
  }
};
 
export default Data;
