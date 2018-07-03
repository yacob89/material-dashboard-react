// React Class

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { RegularCard, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";
import auth from 'utils/auth';
// Components
import FileBrowser from 'react-keyed-file-browser'
import 'views/Typography/react-keyed-file-browser.css'
import Moment from 'moment'

const rows = [];

class Typography extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files:[]
      /*files: [
        {
          key: 'photos/animals/cat in a hat.png',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'photos/animals/kitten_ball.png',
          modified: +Moment().subtract(3, 'days'),
          size: 545 * 1024,
        },
        {
          key: 'photos/animals/elephants.png',
          modified: +Moment().subtract(3, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'photos/funny fall.gif',
          modified: +Moment().subtract(2, 'months'),
          size: 13.2 * 1024 * 1024,
        },
        {
          key: 'photos/holiday.jpg',
          modified: +Moment().subtract(25, 'days'),
          size: 85 * 1024,
        },
        {
          key: 'documents/letter chunks.doc',
          modified: +Moment().subtract(15, 'days'),
          size: 480 * 1024,
        },
        {
          key: 'documents/export.pdf',
          modified: +Moment().subtract(15, 'days'),
          size: 4.2 * 1024 * 1024,
        },
      ]*/
    };
    this.loadFileList = this.loadFileList.bind(this);
  }

  componentDidMount(){
    console.log("User info: ", auth.getUserInfo().username);
    this.loadFileList();
  }

  loadFileList() {
    // Make a request for a user with a given ID

      axios.get('http://192.168.1.5:7555/api/filelist').then(response => {
        // handle success
        console.log(response);
        const fileList = response.data.Contents
        console.log(fileList);

        var i;
        for (i = 0; i < fileList.length; i++) {
          console.log("Key: ", i, " : ", fileList[i].Key);
          console.log("Last Modified: ", i, " : ", fileList[i].LastModified);
          console.log("Size: ", i, " : ", fileList[i].Size);
          rows.push({
            key: fileList[i].Key,
            modified: fileList[i].LastModified,
            size: fileList[i].Size
          });
        }
        this.setState({ files:rows });
      });
  }

  render() {
    return (
      <div>
      <FileBrowser
      files={this.state.files}
    />
      </div>
    );
  }
}

<Typography />;

export default Typography;
