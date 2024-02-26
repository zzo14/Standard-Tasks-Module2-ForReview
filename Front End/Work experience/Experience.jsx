/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput, SingleInput } from '../Form/SingleInput.jsx';
import { Table, TableBody, TableHeader, TableHeaderCell, TableCell, TableRow, Icon, Button, GridRow, GridColumn, Grid } from 'semantic-ui-react';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        const experienceData = this.props.experienceData ?
            Object.assign([], this.props.experienceData)
            : [
                {
                    company: "",
                    position: "",
                    responsibilities: "",
                    start: "",
                    end: ""
                }
            ]

        this.state = {
            showAddSection: false,
            showEditSection: false,
            newExperience: experienceData,
            editingExpId: null
        }

        this.openEdit = this.openEdit.bind(this)
        this.openAdd = this.openAdd.bind(this)
        this.closeEdit_Add = this.closeEdit_Add.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveExperience = this.saveExperience.bind(this)
        this.deleteExperience = this.deleteExperience.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.renderEdit_Add = this.renderEdit_Add.bind(this)
        this.formatDate = this.formatDate.bind(this)
        this.formatDateForInput = this.formatDateForInput.bind(this)
    };

    openEdit(expId) {
        const expToEdit = this.props.experienceData.find(exp => exp.id === expId);
        this.setState({
            showEditSection: true,
            newExperience: expToEdit,
            editingExpId: expId
        });
    }

    openAdd() {
        const exp = {
            company: "",
            position: "",
            responsibilities: "",
            start: "",
            end: ""
        }
        this.setState({
            showAddSection: true,
            newExperience: exp
        })
    }

    closeEdit_Add() {
        this.setState({
            showEditSection: false,
            showAddSection: false,
            editingExpId: null,
                newExperience: {
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: ""
            }
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newExperience)
        data[event.target.name] = event.target.value
        this.setState({
            newExperience: data
        })
    }

    deleteExperience(expId) {
        let experience = this.props.experienceData.slice();
        if (expId) {
            experience = experience.filter(exp => exp.id !== expId);
        } else {
            experience.pop();
        }
        this.props.updateProfileData({ experience });
    }

    saveExperience() {
        const { company, position, responsibilities, start, end } = this.state.newExperience;
        if (company === "" || position === "" || responsibilities === "" || start === "" || end === "") {
            TalentUtil.notification.show("Please enter all the fields", "error", null, null);
            return;
        }
        if (end <= start) {
            TalentUtil.notification.show("End date must be later than start date.", "error", null, null)
            return;
        }

        let experience = this.props.experienceData.slice();
        if (this.state.editingExpId === null) {
            const newExp = { company, position, responsibilities, start, end };
            experience = experience.concat(newExp);
        } else {
            experience = experience.map(exp => {
                if (exp.id === this.state.editingExpId) {
                    return Object.assign({}, exp, { company, position, responsibilities, start, end });
                }
                return exp;
            });
        }
        this.props.updateProfileData({ experience });
        this.closeEdit_Add()
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-EN', { month: 'short' });
        const year = date.getFullYear();

        let daySuffix;
        if (day % 10 === 1 && day !== 11) {
            daySuffix = "st";
        } else if (day % 10 === 2 && day !== 12) {
            daySuffix = "nd";
        } else if (day % 10 === 3 && day !== 13) {
            daySuffix = "rd";
        } else {
            daySuffix = "th";
        }

        return `${day}${daySuffix} ${month}, ${year}`;
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

    render() {
        return (
            <div>
                {this.state.showAddSection ? this.renderEdit_Add() : null}
                {this.state.showEditSection ? this.renderEdit_Add() : null}
                {this.renderDisplay()}
            </div>
        )
    }

    renderDisplay() {
        return (
            <div className='row'>
                <div className="ui sixteen wide column table-language-display">
                    <Table fixed>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Company</TableHeaderCell>
                                <TableHeaderCell>Position</TableHeaderCell>
                                <TableHeaderCell>Responsibilities</TableHeaderCell>
                                <TableHeaderCell>Start</TableHeaderCell>
                                <TableHeaderCell>End</TableHeaderCell>
                                <TableHeaderCell>
                                    <Button type="button" className="ui right floated teal button" onClick={this.openAdd}>
                                        <Icon name="plus" />Add New
                                    </Button>
                                </TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.props.experienceData.map((exp) => {
                                return (
                                    <TableRow key={exp.id}>
                                        <TableCell>{exp.company}</TableCell>
                                        <TableCell>{exp.position}</TableCell>
                                        <TableCell>{exp.responsibilities}</TableCell>
                                        <TableCell>{this.formatDate(exp.start)}</TableCell>
                                        <TableCell>{this.formatDate(exp.end)}</TableCell>
                                        <TableCell>
                                            <Icon name="delete" color='black' className="icon-right" onClick={() => this.deleteExperience(exp.id)} />
                                            <Icon name="pencil" color='black' className="icon-right" onClick={() => this.openEdit(exp.id)} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    renderEdit_Add() {
        const { company, position, responsibilities, start, end } = this.state.newExperience;

        return (
            <div className='ui sixteen wide column'>
                <Grid columns='equal'>
                    <GridRow>
                        <GridColumn width={8}>
                            <ChildSingleInput
                                inputType="text"
                                label="Company"
                                name="company"
                                value={company}
                                controlFunc={this.handleChange}
                                placeholder="Company"
                                errorMessage="Please enter a valid company"
                            />
                        </GridColumn>
                        <GridColumn width={8}>
                            <ChildSingleInput
                                inputType="text"
                                label="Position"
                                name="position"
                                value={position}
                                controlFunc={this.handleChange}
                                placeholder="Position"
                                errorMessage="Please enter a valid position"
                            />
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn width={8}>
                            <div className="field">
                                <label>Start Date</label>
                                <SingleInput
                                    inputType="date"
                                    errorMessage="Please select a valid date"
                                    name="start"
                                    controlFunc={this.handleChange}
                                    content={this.formatDateForInput(start)}
                                    placeholder="start Date"
                                    isError={false}
                                />
                            </div>
                        </GridColumn>
                        <GridColumn width={8}>
                            <div className="field">
                                <label>End Date</label>
                                <SingleInput
                                    inputType="date"
                                    errorMessage="Please select a valid date"
                                    name="end"
                                    controlFunc={this.handleChange}
                                    content={this.formatDateForInput(end)}
                                    placeholder="End Date"
                                    isError={false}
                                />
                            </div>
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn width={16}>
                            <ChildSingleInput
                                inputType="text"
                                label="Responsibilities"
                                name="responsibilities"
                                value={responsibilities}
                                controlFunc={this.handleChange}
                                maxLength={6}
                                placeholder="Responsibilities"
                                errorMessage="Please enter a valid responsibilities"
                            />
                        </GridColumn>
                    </GridRow>
                </Grid>
                <br />
                <button type="button" className="ui teal button" onClick={this.saveExperience}>
                    {this.state.showAddSection && <span>Add</span>} 
                    {this.state.showEditSection && <span>Update</span>} 
                </button>
                <button type="button" className="ui button" onClick={this.closeEdit_Add}>Cancel</button>
            </div>
        )
    }
}
