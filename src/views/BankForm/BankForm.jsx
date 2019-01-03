import React from "react";
import { Grid, InputLabel } from "material-ui";
import axios, { post } from "axios"
import auth from 'utils/auth';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Dropzone from 'react-dropzone';
import Moment from 'react-moment';
import Img from 'react-image';
import NumberFormat from 'react-number-format';

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
  HelpBlock,
  Radio
} from "react-bootstrap";

import avatar from "assets/img/faces/marc.jpg";

//const SERVER_URL = 'http://192.168.1.11:7555';
const STRAPI_URL = 'https://db.mapid.io';
const SERVER_URL = 'https://geo.mapid.io';
const TEMP_URL = 'http://localhost';
const LITE_PRICE = 250000;
const PRO_PRICE = 500000;
const PROMO_CODE_MAPID = 'mapidseeit';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const columns = [{
  dataField: 'username',
  text: 'Username',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
}, {
  dataField: 'fullname',
  text: 'Full Name',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
}, 
{
  dataField: 'user_bank',
  text: 'Payment Source',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
},  
{
  dataField: 'amount',
  text: 'Amount',
  headerStyle: {
    backgroundColor: '#bec1ce'
  }
},
{
  dataField: 'payment_date',
  text: 'Payment Date',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },style: (cell, row, rowIndex, colIndex) => {
    return {
      backgroundColor: 'white'
    };
  }
},
{
  dataField: 'expired_date',
  text: 'Expired Date',
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
  dataField: 'status',
  text: 'Payment Status',
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
  dataField: '_id',
  text: 'ID',
  headerStyle: {
    backgroundColor: '#bec1ce'
  },
  hidden: true
}
];

const rowEvents = {
onClick: (e, row, rowIndex) => {
  alert(`Layer Deleted at: ${rowIndex}`);
}
};

let rows = [];
var payment_count = 0;

class BankForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      files: [],
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
      fullname: '',
      bank: 'mandiri',
      amount: 250000,
      payment_date: '',
      expired_date: '',
      trial:'',
      etc:'',
      promo_code:'',
      license:'lite',
      cycle_count:0,
      duration:1,
      account_number: '',
      bank_source:'bca',
      status:'',
      formData: null,
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      address: "",
      postcode: "",
      country: "",
      organization: "",
      account_type: "",
      current_license:'',
      current_expire_date:''
    };
    this.fileUpload = this.fileUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.loadSensorList = this.loadSensorList.bind(this);
    this.loadUserProfile = this.loadUserProfile.bind(this);
  }

  async componentDidMount() {
    console.log("User Info", auth.getUserInfo());
    console.log("User ID ", auth.getUserInfo()._id);
    this.setState({
      username: auth.getUserInfo().username
    });
    this.loadSensorList();
    this.loadUserProfile();
  }

  componentWillMount(){
    
  }

  onDrop(files) {
    /*this.setState({
      files: files.map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }))
    });*/

    this.setState({
      files,
      file:files[0]
    });
    console.log('File Dropped: ', this.state.file);
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    /*const {files} = this.state;
    for (let i = files.length; i >= 0; i--) {
      const file = files[0];
      URL.revokeObjectURL(file.preview);
    }*/
  }

  loadUserProfile() {
    axios
      .get(STRAPI_URL + "/userdetail", {
        params: {
          username: auth.getUserInfo().username
        }
      })
      .then(response => {
        // handle success
        if (response.data) {
          const userdetails = response.data;
          this.setState({
            id: userdetails[0]._id,
            firstname: userdetails[0].firstname,
            lastname: userdetails[0].lastname,
            email: auth.getUserInfo().email,
            address: userdetails[0].address,
            postcode: userdetails[0].postcode,
            country: userdetails[0].country,
            organization: userdetails[0].organization,
            account_type: userdetails[0].account_type
          });
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
        //setTimeout(this.loadUserProfile(),3000);
      })
      .then(function() {
        // always executed
        //setTimeout(this.loadUserProfile(),3000);
      });
  }

  loadSensorList() {
    // Make a request for a user with a given ID
    rows = [];

    axios.get(STRAPI_URL + '/manualpayment', {
      params: {
        username: auth.getUserInfo().username
      }
    }).then(response => {
      // handle success
      console.log(response);
      const paymentList = response.data
      console.log(paymentList);

      var i;
      var total = 0;
      payment_count = 0;
      for (i = 0; i < paymentList.length; i++) {
        rows.push({
          username: paymentList[i].username,
          fullname: paymentList[i].fullname,
          user_bank: paymentList[i].user_bank,
          amount: paymentList[i].amount,
          payment_date: paymentList[i].payment_date,
          expired_date: paymentList[i].expired_date,
          status: paymentList[i].status,
          cycle_count: paymentList[i].cycle_count
        });
        if (paymentList[i].status === 'pending'){
          payment_count = payment_count + 1;
        }
        if (paymentList[i].status === 'accept'){
          this.setState({ current_license: paymentList[i].license, current_expire_date: paymentList[i].expired_date });
        }
      }
      this.setState({ rowData: rows });
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
    if (event.target.id == 'fullname'){
      this.setState({fullname: event.target.value});
    }
    if (event.target.id == 'bank'){
      this.setState({bank: event.target.value});
    }
    if (event.target.id == 'amount'){
      this.setState({amount: event.target.value});
    }
    if (event.target.id == 'bank_source'){
      this.setState({bank_source: event.target.value});
    }
    if (event.target.id == 'account_number'){
      this.setState({account_number: event.target.value});
    }
    if (event.target.id == 'etc'){
      this.setState({etc: event.target.value});
    }
    if (event.target.id == 'promo_code'){
      this.setState({promo_code: event.target.value});
      if(event.target.value === 'mapidseeit'){
        if(this.state.duration == 3 || this.state.duration == 6){
          this.setState({amount: this.state.amount * 0.8});
        }
        if(this.state.duration == 12){
          this.setState({amount: this.state.amount * 0.5});
        }
        if(this.state.duration == 1){
          this.setState({amount: this.state.amount});
        }
      }
      else{
        var price;
        if(this.state.license === 'lite'){
          price = LITE_PRICE * this.state.duration;
          this.setState({amount: price});
        }
        else{
          price = PRO_PRICE * this.state.duration;
          this.setState({amount: price});
        }
      }
    }
    if (event.target.id == 'license1'){
      this.setState({license: event.target.value});
      if(this.state.promo_code === PROMO_CODE_MAPID){
        if(this.state.duration === '3' || this.state.duration === '6'){
          this.setState({amount: (LITE_PRICE * this.state.duration)*0.8});
        }
        if(this.state.duration === '12'){
          this.setState({amount: (LITE_PRICE * this.state.duration)*0.5});
        }
        else{
          this.setState({amount: LITE_PRICE * this.state.duration});
        }
      }
      else{
        this.setState({amount: LITE_PRICE * this.state.duration});
      }
    }
    if (event.target.id == 'license2'){
      this.setState({license: event.target.value});
      if(this.state.promo_code === PROMO_CODE_MAPID){
        if(this.state.duration === '3' || this.state.duration === '6'){
          this.setState({amount: (PRO_PRICE * this.state.duration)*0.8});
        }
        if(this.state.duration === '12'){
          this.setState({amount: (PRO_PRICE * this.state.duration)*0.5});
        }
        else{
          this.setState({amount: PRO_PRICE * this.state.duration});
        }
      }
      else{
        this.setState({amount: PRO_PRICE * this.state.duration});
      }
    }
    if (event.target.id == 'duration1'){
      this.setState({duration: event.target.value});
      if (this.state.license === 'lite'){
        this.setState({amount: LITE_PRICE * 1});
      }
      else{
        this.setState({amount: PRO_PRICE * 1});
      }
    }
    if (event.target.id == 'duration2'){
      this.setState({duration: event.target.value});
      if(this.state.promo_code === PROMO_CODE_MAPID){
        if (this.state.license === 'lite'){
          this.setState({amount: (LITE_PRICE * 3)*0.8});
        }
        else{
          this.setState({amount: (PRO_PRICE * 3)*0.8});
        }
      }
      else{
        if (this.state.license === 'lite'){
          this.setState({amount: LITE_PRICE * 3});
        }
        else{
          this.setState({amount: PRO_PRICE * 3});
        }
      }
    }
    if (event.target.id == 'duration3'){
      this.setState({duration: event.target.value});
      if(this.state.promo_code === PROMO_CODE_MAPID){
        if (this.state.license === 'lite'){
          this.setState({amount: (LITE_PRICE * 6)*0.8});
        }
        else{
          this.setState({amount: (PRO_PRICE * 6)*0.8});
        }
      }
      else{
        if (this.state.license === 'lite'){
          this.setState({amount: LITE_PRICE * 6});
        }
        else{
          this.setState({amount: PRO_PRICE * 6});
        }
      }
    }
    if (event.target.id == 'duration4'){
      this.setState({duration: event.target.value});
      if(this.state.promo_code === PROMO_CODE_MAPID){
        if (this.state.license === 'lite'){
          this.setState({amount: (LITE_PRICE * 12)*0.5});
        }
        else{
          this.setState({amount: (PRO_PRICE * 12)*0.5});
        }
      }
      else{
        if (this.state.license === 'lite'){
          this.setState({amount: LITE_PRICE * 12});
        }
        else{
          this.setState({amount: PRO_PRICE * 12});
        }
      }
    }
    
  }

  handleSubmit = e => {
    e.preventDefault();

    if(payment_count >= 1){
      alert('You already have a payment pending. Please wait until your payment get confirmed.');
    }
    else{
      if (!this.state.file || !this.state.fullname || !this.state.bank || !this.state.amount || !this.state.bank_source || !this.state.account_number){
        alert('Silahkan Lengkapi Data Pembayaran Dengan Bukti Pembayaran');
      }
      else{
        this.fileUpload(this.state.file).then(response => {
          console.log("Respon dari sebuah data: ", response.data);
          if(response.data === 'success'){
            alert('Payment info submitted, please wait for confirmation');
          }
          else if(response.data === 'error'){
            alert('Cannot submit payment info, please try again');
          }
          else{
            alert('Something goes wrong, please try again');
          }
        });
      }
    }
  };

  fileUpload(file) {
    var FormData = require('form-data');

    var formData = new FormData();

    formData.append("file", file);
    formData.append("username", auth.getUserInfo().username);
    formData.append("userid", this.state.id);
    formData.append("filekey", file.name);
    formData.append("fullname", this.state.fullname);
    formData.append("bank", this.state.bank);
    formData.append("account_number", this.state.account_number);
    formData.append("bank_source", this.state.bank_source);
    formData.append("amount", this.state.amount);
    formData.append("etc", this.state.etc);
    formData.append("promo_code", this.state.promo_code);
    formData.append("license", this.state.license);
    formData.append("duration", this.state.duration);
    formData.append("cycle_count", this.state.cycle_count);
    console.log("Filekey: ", file.name);

    const url = SERVER_URL+'/api-paymentupload';
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'content-language': auth.getUserInfo().username
      }
    }
    return post(url, formData, config)
  }

  render() {

    const customInputText = {
      color: 'black'
    };

    var imgsource = 'https://s3-us-west-2.amazonaws.com/geomapid-assets/img/price.jpeg';

    var priceStyle = {
      width: '1000px',
      height: '600px',
      backgroundImage: 'url(' + imgsource + ')',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    };

    const rowStyle2 = (row, rowIndex) => {
      const style = {};
      style.backgroundColor = rows[rowIndex].color;
      style.borderStyle = 'none';

      return style;
    };

    const { files } = this.state;

    const thumbs = files.map(file => (
      <div style={thumb}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ));

    return (

      <div>
      <Grid container>
              <ItemGrid xs={12} sm={12} md={12}>
              <div style = {priceStyle}></div>
              </ItemGrid>
              </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={11}>
            <form onSubmit={this.handleSubmit}>
              <Grid container>
                <ItemGrid xs={12} sm={12} md={11}>
                  <RegularCard
                    headerColor="blue"
                    cardTitle="Insert your payment information"
                    cardSubtitle="Please insert your payment detail"
                    content={
                      <div>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Full Name</ControlLabel>
                              <FormControl
                                id="fullname"
                                type="text"
                                value={this.state.fullname}
                                placeholder="Enter text"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup controlId="formControlsSelect">
                              <ControlLabel>Source Bank</ControlLabel>
                              <FormControl componentClass="select" placeholder="select" id="bank_source" value={this.state.bank_source} onChange={this.handleChange}>
                                <option value='bca'>Bank BCA</option>
                                <option value='mandiri'>Bank Mandiri</option>
                                <option value='bni'>Bank BNI</option>
                                <option value='bni_syariah'>Bank BNI Syariah</option>
                                <option value='bri'>Bank BRI</option>
                                <option value='syariah_mandiri'>Bank Syariah Mandiri</option>
                                <option value='cimb_niaga'>Bank CIMB NIAGA</option>
                                <option value='cimb_niaga_syariah'>Bank CIMB NIAGA SYARIAH</option>
                                <option value='muamalat'>Bank MUAMALAT</option>
                                <option value='btpn'>Bank Tabungan Pensiunan Nasional (BTPN)</option>
                                <option value='jenius'>JENIUS</option>
                                <option value='bri_syariah'>Bank BRI Syariah</option>
                                <option value='btn'>Bank Tabungan Negara (BTN)</option>
                                <option value='permata'>PERMATA BANK</option>
                                <option value='danamon'>Bank DANAMON</option>
                                <option value='bii_maybank'>Bank BII MAYBANK</option>
                                <option value='mega'>Bank Mega</option>
                                <option value='sinarmas'>Bank Sinarmas</option>
                                <option value='commonwealth'>Bank COMMONWEALTH</option>
                                <option value='ocbc_nisp'>Bank OCBC NISP</option>
                                <option value='bukopin'>Bank BUKOPIN</option>
                                <option value='bca_syariah'>Bank BCA Syariah</option>
                                <option value='lippo'>Bank LIPPO</option>
                                <option value='citibank'>Bank CITIBANK</option>
                              </FormControl>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Bank Account Number</ControlLabel>
                              <FormControl
                                id="account_number"
                                type="text"
                                value={this.state.account_number}
                                placeholder="Enter text"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup controlId="formControlsSelect">
                              <ControlLabel>Destination Bank Mandiri (130-00-8877878-5 a.n PT. Multi Areal Planing Indonesia)</ControlLabel>
                              <FormControl componentClass="select" placeholder="select" id="bank" value={this.state.bank} onChange={this.handleChange}>
                                <option value='mandiri'>Bank Mandiri</option>
                              </FormControl>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Notes</ControlLabel>
                              <FormControl
                                id="etc"
                                type="text"
                                value={this.state.etc}
                                placeholder="Enter Text"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Transfer Amount (IDR)</ControlLabel>
                              
                              <p><span><strong><NumberFormat value={this.state.amount} displayType={'text'} thousandSeparator={true} prefix={'Rp '} /></strong></span></p>
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                          <ControlLabel>Select Your Plan</ControlLabel>
                            <FormGroup>
                              <Radio name="radioGroup" defaultChecked defaultValue id="license1" value="lite" onChange={this.handleChange} inline>
                              Lite
                            </Radio>{' '}
                              <Radio name="radioGroup" id="license2" value="pro" onChange={this.handleChange} inline>
                                Pro
                            </Radio>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                          <ControlLabel>Membership Duration</ControlLabel>
                            <FormGroup>
                              <Radio name="durationRadioGroup" defaultChecked defaultValue id="duration1" value="1" onChange={this.handleChange} inline>
                                1 month
                            </Radio>{' '}
                              <Radio name="durationRadioGroup" id="duration2" value="3" onChange={this.handleChange} inline>
                                3 month
                            </Radio>{' '}
                              <Radio name="durationRadioGroup" id="duration3" value="6" onChange={this.handleChange} inline>
                                6 month
                            </Radio>
                              <Radio name="durationRadioGroup" id="duration4" value="12" onChange={this.handleChange} inline>
                                  1 Year
                              </Radio>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <FormGroup
                              controlId="formBasicText"
                              validationState={this.getValidationState()}
                            >
                              <ControlLabel>Promo Code</ControlLabel>
                              <FormControl
                                id="promo_code"
                                type="text"
                                value={this.state.promo_code}
                                placeholder="Enter promo code here to get limited offers"
                                onChange={this.handleChange}
                              />
                              <FormControl.Feedback />
                              <HelpBlock></HelpBlock>
                            </FormGroup>
                          </ItemGrid>
                        </Grid>
                        <Grid container>
                          <ItemGrid xs={12} sm={12} md={12}>
                            <RegularCard
                              headerColor="blue"
                              plainCard
                              cardTitle="Upload Payment Image"
                              cardSubtitle={'Drag your photos here '}
                              content={<section>
                                <div className="dropzone">
                                  <Dropzone
                                    accept="image/*"
                                    onDrop={this.onDrop.bind(this)}
                                  />
                                </div>
                                <aside style={thumbsContainer}>
                                  {thumbs}
                                </aside>
                              </section>}
                            />
                          </ItemGrid>
                        </Grid>
                      </div>
                    }
                    footer={<Button color="bluemapid" type="submit" value="Submit">Submit Payment</Button>}
                  />
                </ItemGrid>
                <ItemGrid xs={12} sm={12} md={1}>
                </ItemGrid>
              </Grid>
            </form>

          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={1}>
          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              headerColor="blue"
              plainCard
              cardTitle={'Current Active Membership ' + this.state.current_license}
              cardSubtitle={'Your Active Subscription'}
              content={
                <div>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                      <p><strong>{'Membership expired '}<Moment fromNow>{this.state.current_expire_date}</Moment></strong></p>
                    </ItemGrid>

                  </Grid>
                  <Grid container>
                    <ItemGrid xs={12} sm={12} md={12}>
                      <BootstrapTable
                        keyField="id"
                        data={this.state.rowData}
                        columns={columns}
                        striped
                        hover
                        condensed
                        bordered={true}
                        rowStyle={rowStyle2}
                        noDataIndication="No Payment is Submitted"
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
                    </ItemGrid>

                  </Grid>
                </div>
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

<BankForm />;

export default BankForm;
