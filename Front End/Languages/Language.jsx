/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import { Table, TableBody, TableHeader, TableHeaderCell, TableCell, TableRow, Icon, Button, GridRow, GridColumn, Grid } from 'semantic-ui-react';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        const languageData = props.languageData ?
            Object.assign([], props.languageData)
            : [
                {
                    name: "",
                    level: "",
                }
            ]
        this.state = {
            showEditSection: false,
            showAddSection: false,
            newLanguage: languageData,
            editingLanguageId: null,
        }

        this.openEdit = this.openEdit.bind(this)
        this.openAdd = this.openAdd.bind(this)
        this.closeEdit_Add = this.closeEdit_Add.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteLanguage = this.deleteLanguage.bind(this)
        this.saveLanguage = this.saveLanguage.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderAdd = this.renderAdd.bind(this)
        this.levelOptions = this.levelOptions.bind(this)
    }

    openEdit(languageId) {
        const languageToEdit = this.props.languageData.find(lang => lang.id === languageId);
        this.setState({
            showEditSection: true,
            newLanguage: languageToEdit,
            editingLanguageId: languageId,
        });
    }

    openAdd() {
        const languages = {
            name: "",
            level: "",
        }
        this.setState({
            showAddSection: true,
            newLanguage: languages
        })
    }

    closeEdit_Add() {
        this.setState({
            showEditSection: false,
            showAddSection: false,
            editingLanguageId: null,
            newLanguage: { name: "", level: "" }
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newLanguage)
        data[event.target.name] = event.target.value
        this.setState({
            newLanguage: data
        })
    }

    deleteLanguage(languageId) {
        let languages = this.props.languageData.slice();
        if (languageId) {
            languages = languages.filter(lang => lang.id !== languageId);
        } else {
            languages.pop();
        }
        this.props.updateProfileData({ languages })
    }

    saveLanguage() {
        const { name, level } = this.state.newLanguage;
        if (name === "" || level === "") {
            TalentUtil.notification.show("Please select a valid language and level", "error", null, null);
            return;
        }
         
        let languages = this.props.languageData.slice();
        if (this.state.editingLanguageId === null) {
            const newLanguage = { name, level };
            languages = languages.concat(newLanguage);
        } else {
            languages = languages.map(lang => {
                if (lang.id === this.state.editingLanguageId) {
                    return Object.assign({}, lang, { name, level });
                }
                return lang;
            });
        }
        this.props.updateProfileData({ languages });
        this.closeEdit_Add();
    }

    levelOptions() {
        let levelOptions = [
            { value: "Basic", title: "Basic" },
            { value: "Conversational", title: "Conversational" },
            { value: "Fluent", title: "Fluent" },
            { value: "Native/Bilingual", title: "Native/Bilingual" }
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
                                <TableHeaderCell>Language</TableHeaderCell>
                                <TableHeaderCell>Levle</TableHeaderCell>
                                <TableHeaderCell>
                                    <Button type="button" className="ui right floated teal button" onClick={this.openAdd}>
                                        <Icon name="plus" />Add New
                                    </Button>
                                </TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {this.props.languageData.map((language) => {
                                if (this.state.editingLanguageId === language.id && this.state.showEditSection) {
                                    return (
                                        <TableRow key={language.id}>
                                            <TableCell colSpan="3">
                                                {this.renderEdit()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={language.id}>
                                            <TableCell>{language.name}</TableCell>
                                            <TableCell>{language.level}</TableCell>
                                            <TableCell>
                                                <Icon name="delete" color='black' className="icon-right" onClick={() => this.deleteLanguage(language.id)} />
                                                <Icon name="pencil" color='black' className="icon-right" onClick={() => this.openEdit(language.id)} />
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
        const { name, level } = this.state.newLanguage;

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
                                placeholder="Add Language"
                                errorMessage="Please enter a valid Language"
                            />
                        </GridColumn>
                        <GridColumn>
                            <div className="dropdown-margin-top">
                                <Select
                                    name="level"
                                    options={this.levelOptions()}
                                    selectedOption={level}
                                    controlFunc={this.handleChange}
                                    placeholder="Language Level"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn>
                            <button type="button" className="ui teal button dropdown-margin-top " onClick={this.saveLanguage}>Add</button>
                            <button type="button" className="ui button dropdown-margin-top " onClick={this.closeEdit_Add}>Cancel</button>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        )
    }

    renderEdit() {
        const { name, level } = this.state.newLanguage;

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
                                placeholder="Add Language"
                                errorMessage="Please enter a valid Language"
                            />
                        </GridColumn>
                        <GridColumn>
                            <div className="dropdown-margin-top">
                                <Select
                                    name="level"
                                    options={this.levelOptions()}
                                    selectedOption={level}
                                    controlFunc={this.handleChange}
                                    placeholder="Language Level"
                                />
                            </div>
                        </GridColumn>
                        <GridColumn>
                            <Button type="button" basic color='blue' className="dropdown-margin-top" onClick={this.saveLanguage}>Update</Button>
                            <Button type="button" basic color="red" className="dropdown-margin-top" onClick={this.closeEdit_Add}>Cancel</Button>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>
        );
    }
}