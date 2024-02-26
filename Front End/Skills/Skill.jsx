/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Table, TableBody, TableHeader, TableHeaderCell, TableCell, TableRow, Icon, Button, GridRow, GridColumn, Grid } from 'semantic-ui-react';

export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        const skillData = props.skillData ?
            Object.assign([], props.skillData)
            : [
                {
                    name: "",
                    level: "",
                }
            ]
        this.state = {
            showEditSection: false,
            showAddSection: false,
            newSkill: skillData,
            editingSkillId: null,
        }

        this.openEdit = this.openEdit.bind(this)
        this.openAdd = this.openAdd.bind(this)
        this.closeEdit_Add = this.closeEdit_Add.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteSkill = this.deleteSkill.bind(this)
        this.saveSkill = this.saveSkill.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderAdd = this.renderAdd.bind(this)
        this.levelOptions = this.levelOptions.bind(this)
    };

    openEdit(skillId) {
        const skillToEdit = this.props.skillData.find(skill => skill.id === skillId);
        this.setState({
            showEditSection: true,
            newSkill: skillToEdit,
            editingSkillId: skillId,
        });
    }

    openAdd() {
        const skills = {
            name: "",
            level: "",
        }
        this.setState({
            showAddSection: true,
            newSkill: skills
        })
    }

    closeEdit_Add() {
        this.setState({
            showEditSection: false,
            showAddSection: false,
            editingSkillId: null,
            newLanguage: { name: "", level: "" }
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newSkill)
        data[event.target.name] = event.target.value
        this.setState({
            newSkill: data
        })
    }

    deleteSkill(skillId) {
        let skills = this.props.skillData.slice();
        if (skillId) {
            skills = skills.filter(skill => skill.id !== skillId);
        } else {
            skills.pop();
        }
        this.props.updateProfileData({ skills });
    }

    saveSkill() {
        const { name, level } = this.state.newSkill;
        if (name === "" || level === "") {
            TalentUtil.notification.show("Please select a valid skill and level", "error", null, null);
            return;
        }

        let skills = this.props.skillData.slice();
        if (this.state.editingSkillId === null) {
            const newSkill = { name, level };
            skills = skills.concat(newSkill);
        } else {
            skills = skills.map(skill => {
                if (skill.id === this.state.editingSkillId) {
                    return Object.assign({}, skill, { name, level });
                }
                return skill;
            });
        }
        this.props.updateProfileData({ skills });
        this.closeEdit_Add();
    }

    levelOptions() {
        let levelOptions = [
            { value: "Beginner", title: "Beginner" },
            { value: "Intermediate", title: "Intermediate" },
            { value: "Expert", title: "Expert" },
        ]
        return levelOptions
    }


    render() {
        return (
            <div>
                {this.state.showAddSection ? this.renderAdd() : null}
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
                                <TableHeaderCell>Skill</TableHeaderCell>
                                <TableHeaderCell>Levle</TableHeaderCell>
                                <TableHeaderCell>
                                    <Button type="button" className="ui right floated teal button" onClick={this.openAdd}>
                                        <Icon name="plus" />Add New
                                    </Button>
                                </TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.props.skillData.map((skill) => {
                                if (this.state.editingSkillId === skill.id && this.state.showEditSection) {
                                    return (
                                        <TableRow key={skill.id}>
                                            <TableCell colSpan="3">
                                                {this.renderEdit()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={skill.id}>
                                            <TableCell>{skill.name}</TableCell>
                                            <TableCell>{skill.level}</TableCell>
                                            <TableCell>
                                                <Icon name="delete" color='black' className="icon-right" onClick={() => this.deleteSkill(skill.id)} />
                                                <Icon name="pencil" color='black' className="icon-right" onClick={() => this.openEdit(skill.id)} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    renderAdd() {
        const { name, level } = this.state.newSkill;

        return (
            <div className='ui sixteen wide column table-language-add'>
                <Grid columns='equal'>
                    <GridRow>
                        <GridColumn>
                            <ChildSingleInput
                                inputType="text"
                                name="name"
                                value={name}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Add Skill"
                                errorMessage="Please enter a valid skill"
                            />
                        </GridColumn>
                        <GridColumn>
                            <div className="dropdown-margin-top">
                                <Select
                                    name="level"
                                    options={this.levelOptions()}
                                    selectedOption={level}
                                    controlFunc={this.handleChange}
                                    placeholder="Skill Level"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn>
                            <button type="button" className="ui teal button dropdown-margin-top " onClick={this.saveSkill}>Add</button>
                            <button type="button" className="ui button dropdown-margin-top " onClick={this.closeEdit_Add}>Cancel</button>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        )
    }

    renderEdit() {
        const { name, level } = this.state.newSkill;

        return (
            <div className='ui sixteen wide column table-language-add'>
                <Grid columns='equal'>
                    <GridRow>
                        <GridColumn>
                            <ChildSingleInput
                                inputType="text"
                                name="name"
                                value={name}
                                controlFunc={this.handleChange}
                                maxLength={80}
                                placeholder="Add Skill"
                                errorMessage="Please enter a valid skill"
                            />
                        </GridColumn>
                        <GridColumn>
                            <div className="dropdown-margin-top">
                                <Select
                                    name="level"
                                    options={this.levelOptions()}
                                    selectedOption={level}
                                    controlFunc={this.handleChange}
                                    placeholder="Skill Level"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn>
                            <Button type="button" basic color='blue' className="dropdown-margin-top" onClick={this.saveSkill}>Update</Button>
                            <Button type="button" basic color="red" className="dropdown-margin-top" onClick={this.closeEdit_Add}>Cancel</Button>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        );
    }
}