import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Grid, GridRow, GridColumn } from 'semantic-ui-react';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showEditSection: false,
            visaStatus: props.visaStatus || "",
            visaExpiryDate: props.visaExpiryDate || ""
        }

        this.handleVisaStatusChange = this.handleVisaStatusChange.bind(this)
        this.handleVisaExpiryDateChange = this.handleVisaExpiryDateChange.bind(this)
        this.saveVisaStatus = this.saveVisaStatus.bind(this)
        this.saveVisaExpiryDate = this.saveVisaExpiryDate.bind(this)
        this.visaOptions = this.visaOptions.bind(this)
        this.formatDateForInput = this.formatDateForInput.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
    }

    handleVisaStatusChange(event) {
        const { value } = event.target;
        const showEditSection = value === "Work Visa" || value === "Student Visa";

        // Optionally, save the visa status immediately after state update
        if (value === "Citizen" || value === "Permanent Resident") {
            this.setState({
                visaStatus: value,
                showEditSection: false, 
                visaExpiryDate: "" 
            }, () => {
                this.saveVisaStatus(); 
            });
        } else {
            // Otherwise, just update the state
            this.setState({
                visaStatus: value,
                showEditSection,
                visaExpiryDate: this.state.visaExpiryDate 
            });
        }
    }

    saveVisaStatus() {
        const { visaStatus, visaExpiryDate } = this.state;
        this.props.saveProfileData({ visaStatus, visaExpiryDate });
    }

    handleVisaExpiryDateChange(event) {
        this.setState({
            visaExpiryDate: event.target.value
        });
    }

    saveVisaExpiryDate() {
        if (this.state.visaExpiryDate === "") {
            TalentUtil.notification.show("Please enter a valid date", "error", null, null);
            return;
        }
        this.props.saveProfileData({
            visaStatus: this.state.visaStatus,
            visaExpiryDate: this.state.visaExpiryDate
        });
    }

    visaOptions() {
        let visaOptions = [
            { value: "Citizen", title: "Citizen" },
            { value: "Permanent Resident", title: "Permanent Resident" },
            { value: "Work Visa", title: "Work Visa" },
            { value: "Student Visa", title: "Student Visa" }
        ]
        return visaOptions
    }

    formatDateForInput(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        month = month.length < 2 ? '0' + month : month;
        day = day.length < 2 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visaStatus !== this.props.visaStatus || prevProps.visaExpiryDate !== this.props.visaExpiryDate) {
            this.setState({
                visaStatus: this.props.visaStatus || "",
                visaExpiryDate: this.props.visaExpiryDate || "",
                showEditSection: this.props.visaStatus === "Work Visa" || this.props.visaStatus === "Student Visa" ? true : false
            });
        }
    }


    render() {
        const { visaStatus, showEditSection } = this.state;

        return (
            <div className='ui sixteen wide column'>
                <Grid>
                    <GridRow>
                        <GridColumn width={6}>
                            <div className="field">
                                <label>Visa type</label>
                                <Select
                                    name="visaStatus"
                                    options={this.visaOptions()}
                                    selectedOption={visaStatus}
                                    controlFunc={this.handleVisaStatusChange}
                                    placeholder="Select your Visa type"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn width={10}>
                            {showEditSection && this.renderEdit()}
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        )
    }

    renderEdit() {
        const visaExpiryDate = this.state.visaExpiryDate

        return (
            <div>
                <Grid columns='equal'>
                    <GridRow >
                        <GridColumn width={10}>
                            <div className="field">
                                <label>Visa expiry date</label>
                                <SingleInput
                                    inputType="date"
                                    errorMessage="Please select a valid date"
                                    name="visaExpiryDate"
                                    controlFunc={this.handleVisaExpiryDateChange}
                                    content={this.formatDateForInput(visaExpiryDate)}
                                    placeholder="Enter the expiry date"
                                    isError={false}
                                />
                            </div>
                        </GridColumn>
                        <GridColumn>
                            <div className="field">
                                <label className="label-placeholder">save button</label>
                                <button type="button" className="ui teal button" onClick={this.saveVisaExpiryDate}>Save</button>
                            </div>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        )
    }
}