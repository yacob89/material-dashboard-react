import React from "react";
import { Grid, InputLabel } from "material-ui";
import axios from "axios";
import auth from 'utils/auth';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import {
  ProfileCard,
  RegularCard,
  Button,
  CustomInput,
  ItemGrid
} from "components";

import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from "react-bootstrap";

import Card from 'react-credit-cards';
import SupportedCards from './Cards';
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData,
} from './utils';
import styles from './styles.css';
import 'react-credit-cards/es/styles-compiled.css';

import avatar from "assets/img/faces/marc.jpg";

//const SERVER_URL = 'http://192.168.1.11:7555';
const STRAPI_URL = 'https://db.mapid.io';
const SERVER_URL = 'https://geo.mapid.io';
const TEMP_URL = 'http://localhost';

const columns = [{
  dataField: 'sensor_id',
  text: 'Sensor ID',
  filter: textFilter(),
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
}, {
  dataField: 'name',
  text: 'Name',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: true
}, 
{
  dataField: 'interval',
  text: 'Interval',
  filter: textFilter(),
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  editor: {
    type: Type.SELECT,
    options: [{
      value: '15',
      label: '15'
    }, {
      value: '30',
      label: '30'
    }, {
      value: '60',
      label: '60'
    }, {
      value: '90',
      label: '90'
    }]
  }
},  
{
  dataField: '_id',
  text: 'ID',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  hidden: true
},
{
  dataField: 'dynamicValue',
  text: 'Dynamic Value',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
},
{
  dataField: 'min_value',
  text: 'Min Value',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'max_value',
  text: 'Max Value',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'circle_color',
  text: 'Circle Color',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'inner_color',
  text: 'Inner Color',
  sort: true,
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  hidden: false
}, 
{
  dataField: 'edit',
  text: 'Edit',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  events: {
    onClick: () => alert('Edit layer')
  }
},
{
  dataField: 'delete',
  text: 'Delete',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  },
  events: {
    onClick: () => alert('Delete layer')
  }
},
];

const rowEvents = {
onClick: (e, row, rowIndex) => {
  alert(`Layer Deleted at: ${rowIndex}`);
}
};

let rows = [];

class PaymentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: [],
      rowData: [],
      url: '',
      name: '',
      interval: '30',
      dynamicValue: '',
      min_value:'',
      max_value:'',
      circle_color:'#1a66ff',
      inner_color:'#6699ff',
      username: '',
      number: '',
      cardname: '',
      expiry: '',
      cvc: '',
      issuer: '',
      focused: '',
      formData: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.loadSensorList = this.loadSensorList.bind(this);
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    this.setState({
      username: auth.getUserInfo().username
    });
    this.loadSensorList();
  }

  componentWillMount(){
    
  }

  loadSensorList() {
    // Make a request for a user with a given ID
    rows = [];

    axios.get(STRAPI_URL + '/sensor', {
      params: {
        username: auth.getUserInfo().username
      }
    }).then(response => {
      // handle success
      console.log(response);
      const sensorList = response.data
      console.log(sensorList);

      var i;
      var total = 0;
      for (i = 0; i < sensorList.length; i++) {
        var modifiedDate = new Date(sensorList[i].created_at);
        rows.push({
          sensor_id: sensorList[i].sensor_id,
          name: sensorList[i].name,
          interval: sensorList[i].interval,
          dynamicValue: sensorList[i].dynamicValue,
          min_value: sensorList[i].min_value,
          max_value: sensorList[i].max_value,
          circle_color: sensorList[i].circle_color,
          inner_color: sensorList[i].inner_color,
          _id: sensorList[i]._id,
          delete: "Delete",
          edit: "Edit"
        });
      }
      this.setState({ rowData: rows, showModal: false });
    });
  }

  isSelected = index => {
    return this.state.selected.indexOf(index) !== -1;
  };

  handleRowSelection = selectedRows => {
    this.setState({
      selected: selectedRows
    });
  };

  getValidationState() {
    const length = this.state.url.length;
    if (length > 3) return 'success';
    else if (length > 1) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(event) {
    console.log('URL: ', event.target.value);
    console.log('URL ID: ', event.target.id);
    if (event.target.id == 'url'){
      this.setState({url: event.target.value});
    }
    if (event.target.id == 'name'){
      this.setState({name: event.target.value});
    }
    if (event.target.id == 'interval'){
      this.setState({interval: event.target.value});
    }
    if (event.target.id == 'dynamicValue'){
      this.setState({dynamicValue: event.target.value});
    }
    if (event.target.id == 'min_value'){
      this.setState({min_value: event.target.value});
    }
    if (event.target.id == 'max_value'){
      this.setState({max_value: event.target.value});
    }
    if (event.target.id == 'circle_color'){
      this.setState({circle_color: event.target.value});
    }
    if (event.target.id == 'inner_color'){
      this.setState({inner_color: event.target.value});
    }
    
  }

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name,
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { issuer } = this.state;
    const formData = [...e.target.elements]
      .filter(d => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    console.log('FormData: ', formData);
    axios.post(SERVER_URL+'/midtrans-token', {
      cardnumber: formData.number,
      name: formData.name,
      issuer: formData.issuer,
      expiry: formData.expiry,
      cvc: formData.cvc,
      username: auth.getUserInfo().username
    })
      .then(function (response) {
        console.log('Midtrans Token Response: ', response);
      })
      .catch(function (error) {
        console.log('Midtrans Token error', error);
      });


    this.setState({ formData });
    this.form.reset();
  };

  render() {

    const customInputText = {
      color: 'black'
    };

    const rowStyle2 = (row, rowIndex) => {
      const style = {};
      style.backgroundColor = rows[rowIndex].color;
      style.borderStyle = 'none';
    
      return style;
    };

    const { cardname, number, expiry, cvc, focused, issuer, formData } = this.state;

    return (
      
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={8}>
            <RegularCard
              headerColor="blue"
              plainCard
              cardTitle="Subscribe to mapid"
              cardSubtitle={'Enter your payment method'}
              content={
                <div key="Payment">
                  <div className="App-payment">
                    <Card
                      number={number}
                      name={cardname}
                      expiry={expiry}
                      cvc={cvc}
                      focused={focused}
                      callback={this.handleCallback}
                    />
                    <form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <input
                          type="tel"
                          name="number"
                          className="form-control"
                          placeholder="Card Number"
                          pattern="[\d| ]{16,22}"
                          required
                          onChange={this.handleInputChange}
                          onFocus={this.handleInputFocus}
                        />
                        <small>E.g.: 49..., 51..., 36..., 37...</small>
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name"
                          required
                          onChange={this.handleInputChange}
                          onFocus={this.handleInputFocus}
                        />
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="tel"
                            name="expiry"
                            className="form-control"
                            placeholder="Valid Thru"
                            pattern="\d\d/\d\d"
                            required
                            onChange={this.handleInputChange}
                            onFocus={this.handleInputFocus}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="tel"
                            name="cvc"
                            className="form-control"
                            placeholder="CVC"
                            pattern="\d{3,4}"
                            required
                            onChange={this.handleInputChange}
                            onFocus={this.handleInputFocus}
                          />
                        </div>
                      </div>
                      <input type="hidden" name="issuer" value={issuer} />
                      <div className="form-actions">
                        <button className="btn btn-primary btn-block">Save Payment Method</button>
                      </div>
                    </form>
                    {formData && (
                      <div className="App-highlight">
                        {formatFormData(formData).map((d, i) => <div key={i}>{d}</div>)}
                      </div>
                    )}
                    <hr style={{ margin: '60px 0 30px' }} />

                  </div>
                </div>
              }
            />

          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <RegularCard
              headerColor="blue"
              plainCard
              cardTitle="Your Current Plan"
              cardSubtitle={'Valid Date: '}
              content={<h4>Free</h4>}
            />
          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <SupportedCards />
          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              plainCard
              cardTitle="Current Active Payment"
              cardSubtitle={'Your Active Subscription'}
              content={
                <BootstrapTable
                  keyField="id"
                  data={this.state.rowData}
                  columns={columns}
                  striped
                  hover
                  condensed
                  bordered={true}
                  rowStyle={rowStyle2}
                  noDataIndication="No ioT Layer is Uploaded"
                  filter={filterFactory()}
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    blurToSave: true,
                    beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      console.log('After Saving Cell!!', ' row ', row._id);
                      console.log('After saving cell column: ', column);
                      if (column.dataField == "delete") {
                        console.log("Delete activated!");
                        //this.deleteRemoteData(row._id);
                        //this.testGeojsonUpdate(row._id, row.location, row.color, row.icon, row.filename, row._id)
                      }
                      if (column.dataField == "edit") {
                        console.log("Edit Layer activated!");
                        //this.editRemoteData(row.location);
                        /*this.setState({
                          selectedLocation: row.location,
                          selectedFilename: row.filename,
                          geojsonModal: true
                        });*/
                      }
                    }
                  })}
                />
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

<PaymentPage />;

export default PaymentPage;
