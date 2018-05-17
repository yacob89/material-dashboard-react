// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";
import auth from 'utils/auth';

const JsonTable = require("ts-react-json-table");
var userColumns = ["username", "created_at", "updated_at"];
var userExcludeColumns = ["encrypted_password"];
var layerColumns = ["username", "filename", "created_at", "updated_at"];

class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [1],
      persons: []
    };
  }

  componentDidMount() {
    console.log("User info: ", auth.getUserInfo().username);
    axios.get(`http://192.168.1.5:7555/getUser`).then(res => {
      const persons = res.data;
      this.setState({ persons });

      const converted = Object.keys(persons).map(function(key) {
        var person = persons[key];
        person.name = key;
        return person;
      });

      console.log("Orang ", converted);
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

  render() {
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            cardTitle="User List"
            cardSubtitle="User List"
            content={
              <JsonTable
                theadClassName={"thead-light"}
                className="table table-sm table-bordered"
                rows={this.state.persons}
                excludeColumns={userExcludeColumns}
                columns={userColumns}
              />
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

<TableList />;

export default TableList;
