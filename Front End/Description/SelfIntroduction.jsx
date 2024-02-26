/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { TextArea } from  'semantic-ui-react';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: props.summary || "",
            description: props.description || "",
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveContact = this.saveContact.bind(this);
    }

    handleInputChange(event, fieldName) {
        const value = event.target.value;
        this.setState({
            [fieldName]: value,
        });
    }

    saveContact() {
        const data = {
            summary: this.state.summary,
            description: this.state.description
        };
        this.props.updateProfileData(data);
    }

    componentDidUpdate(prevProps) {
        if (this.props.summary !== prevProps.summary) {
            this.setState({ summary: this.props.summary || "" });
        }
        if (this.props.description !== prevProps.description) {
            this.setState({ description: this.props.description || "" });
        }
    }

    render() {
        const { summary, description } = this.state;

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    name="summary"
                    value={summary}
                    controlFunc={(e) => this.handleInputChange(e, 'summary')}
                    maxLength={150}
                    placeholder="Please provide a short summary about yourself."
                    errorMessage="Please enter a valid summary"
                />
                <p>Summary must be no more than 150 characters.</p>
                <div className="field">
                    <TextArea
                        name="description"
                        value={description}
                        onChange={(e) => this.handleInputChange(e, 'description')}
                        maxLength={600}
                        minLength={150}
                        rows={10}
                        placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add."
                    />
                </div>
                <p>Description must be between 150-600 characters.</p>
                <button type="button" className="ui right floated teal button" onClick={this.saveContact}>Save</button>
            </div>
        );
    }
}