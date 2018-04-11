// React Class

import React, {Component} from 'react';
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from 'axios';

const JsonTable = require('ts-react-json-table');

class TableList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: [1],
      persons: []
    }
  }

  componentDidMount(){
    axios.get(`http://192.168.1.5:7555/getUser`)
      .then(res => {
        const persons = res.data;
        this.setState({ persons });

        const converted = Object.keys(persons).map(function(key) {
          var person = persons[key];
          person.name = key;
          return person;
        });

        console.log("Orang", converted);
      })
  }

  isSelected = (index) => {
    return this.state.selected.indexOf(index) !== -1;
  };

  handleRowSelection = (selectedRows) => {
    this.setState({
      selected: selectedRows,
    });
  };

  render() {
    return (
      <Grid container>
      <ul>
        { this.state.persons.map(person => <li>{person.username}</li>)}
      </ul>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Geojson List"
          cardSubtitle="Geojson List"
          content={
            <JsonTable rows = {this.state.persons} />
          }
        />
      </ItemGrid>
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          plainCard
          cardTitle="Table on Plain Background"
          cardSubtitle="Here is a subtitle for this table"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten"
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
              ]}
            />
          }
        />
      </ItemGrid>
    </Grid>
    );
  }
}

<TableList />

export default TableList;
