import React from 'react';

interface DataState {
  _name: string;
  _id: string;
}

interface DataProps {

}
 
class Data extends React.Component<DataProps, DataState> {
  
  api<T>(url: string): Promise<T> {
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
      _name: '',
      _id: ''
    }

    this.api<{ name: string }>('/data')
    .then(({ name }) => {
      this.setState({_name: name});
    })
    .catch(error => {
      console.error(error);
    })

    this.api<{ name: string }>('/data/1234321')
    .then(({ name }) => {
      this.setState({_id: name});
    })
    .catch(error => {
      console.error(error);
    })
  };

  render() {
    return (
      <p>Hello, {this.state._name}, {this.state._id}</p>
    );
  }
};
 
export default Data;
