import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Button, GridRow, GridColumn, Grid } from 'semantic-ui-react';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        const addressData = props.addressData ?
            Object.assign({}, props.addressData)
            : {
                number: "",
                street: "",
                suburb: "",
                postCode: "",
                city: "",
                country: ""
            }

        this.state = {
            showEditSection: false,
            newAddress: addressData
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const address = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            newAddress: address
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newAddress)
        data[event.target.name] = event.target.value
        //if (event.target.name == "postCode" || event.target.name == "number") {
        //    const isNonNegativeInteger = "" || /^\d+$/.test(event.target.value);
        //    if (!isNonNegativeInteger) {
        //        TalentUtil.notification.show("Please enter a valid number", "error", null, null)
        //    }
        //}
        this.setState({
            newAddress: data
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newAddress)
        const updatedData = {
            address: {
                number: data.number,
                street: data.street,
                suburb: data.suburb,
                postCode: data.postCode,
                city: data.city,
                country: data.country
            }
        };

        if (updatedData.address.number === "" || updatedData.address.street === "" || updatedData.address.suburb === "" || updatedData.address.postCode === "" || updatedData.address.city === "" || updatedData.address.country === "") {
            TalentUtil.notification.show("Please enter a valid address", "error", null, null)
            return;
        }

        const isNumberValid = /^[a-zA-Z0-9]*\d+[a-zA-Z0-9]*$/.test(updatedData.address.number);
        const isPostCodeValid = /^(?!0+$)\d+$/.test(updatedData.address.postCode);
        if (!isNumberValid) {
            TalentUtil.notification.show("Please enter a valid address number", "error", null, null)
            return;
        }
        if (!isPostCodeValid) {
            TalentUtil.notification.show("Please enter a valid post code", "error", null, null)
            return;
        }

        //this.props.updateProfileData(updatedData)
        this.props.saveProfileData(updatedData)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )

    }

    renderEdit() {
        let countriesOptions = [];
        let cityOptions = [];
        const selectedCountry = this.state.newAddress.country;
        const selectedCity = this.state.newAddress.city;
        countriesOptions = Object.keys(Countries).map((x) => ({ value: x, title: x }));
        if (selectedCountry) {
            cityOptions = Countries[selectedCountry].map((x) => ({ value: x, title: x }));
        }

        return (
            <div className='ui sixteen wide column'>
                <Grid columns='equal'>
                    <GridRow>
                        <GridColumn width={4}>
                            <ChildSingleInput
                                inputType="text"
                                label="Number"
                                name="number"
                                value={this.state.newAddress.number}
                                controlFunc={this.handleChange}
                                maxLength={4}
                                placeholder="Enter your number"
                                errorMessage="Please enter a valid number"
                            />
                        </GridColumn>
                        <GridColumn width={8}>
                            <ChildSingleInput
                                inputType="text"
                                label="Street"
                                name="street"
                                value={this.state.newAddress.street}
                                controlFunc={this.handleChange}
                                placeholder="Enter your street"
                                errorMessage="Please enter a valid street"
                            />
                        </GridColumn>
                        <GridColumn width={4}>
                            <ChildSingleInput
                                inputType="text"
                                label="Suburb"
                                name="suburb"
                                value={this.state.newAddress.suburb}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Enter your suburb"
                                errorMessage="Please enter a valid suburb"
                            />
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn width={6}>
                            <div className="field">
                                <label>Country</label>
                                <Select
                                    name="country"
                                    options={countriesOptions}
                                    selectedOption={selectedCountry}
                                    controlFunc={this.handleChange}
                                    placeholder="Select a country"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn width={6}>
                            <div className="field">
                                <label>City</label>
                                <Select
                                    name="city"
                                    options={cityOptions}
                                    selectedOption={selectedCity}
                                    controlFunc={this.handleChange}
                                    placeholder="Select a city"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn width={4}>
                            <ChildSingleInput
                                inputType="text"
                                label="Post Code"
                                name="postCode"
                                value={this.state.newAddress.postCode}
                                controlFunc={this.handleChange}
                                maxLength={6}
                                placeholder="Enter your post code"
                                errorMessage="Please enter a valid post code"
                            />
                        </GridColumn>
                    </GridRow>
                </Grid>
                <br />
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        const { number, street, suburb, postCode, city, country } = this.props.addressData;
        let address = [number, street, suburb, postCode].every(item => !item || item === 0) ? "" : `${number}, ${street}, ${suburb}, ${postCode}`;

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {address}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            nationality: props.nationalityData || ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            nationality: value
        }, this.saveContact)
    }

    saveContact() {
        const data = {
            nationality: this.state.nationality,
        };
        this.props.saveProfileData(data)
    }

    componentDidUpdate(prevProps) {
        if (this.props.nationalityData !== prevProps.nationalityData) {
            this.setState({ nationality: this.props.nationalityData || "" });
        }
    }

    render() {
        let countriesOptions = [];
        const selectedCountry = this.state.nationality;
        countriesOptions = Object.keys(Countries).map((x) => ({ value: x, title: x }));

        return (
            <div className='ui sixteen wide column'>
                <Grid>
                    <GridRow>
                        <GridColumn width={7}>
                            <Select
                                name="nationality"
                                options={countriesOptions}
                                selectedOption={selectedCountry}
                                controlFunc={this.handleChange}
                                placeholder="Select your nationality"
                            />
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        )
    }
}