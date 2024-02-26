import React from 'react'
import { Form, Checkbox, FormField } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        const status = props.status ?
            Object.assign({}, props.status)
            : {
                status: "",
                availableDate: null
            }

        this.state = {
            newStatus: status
        }

        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
    }

    handleChange(event, { name, value }) {
        const data = Object.assign({}, this.state.newStatus)
        data[name] = value
        this.setState({
            newStatus: data
        }, this.saveContact)
    }

    saveContact() {
        const data = Object.assign({}, this.state.newStatus)
        const updateData = {
            jobSeekingStatus: {
                status: data.status,
                availableDate: null
            }
        }
        this.props.saveProfileData(updateData)
    }

    componentDidUpdate(prevProps) {
        if (this.props.status !== prevProps.status) {
            this.setState({ newStatus: this.props.status || "" });
        }
    }

    render() {
        const { status } = this.state.newStatus;

        return (
            <div className='ui sixteen wide column'>
                <FormField>
                    <label>Current Status</label>
                </FormField>
                {[
                    "Actively looking for a job",
                    "Not looking for a job at the moment",
                    "Currently employed but open to offers",
                    "Will be available on later date"
                ].map(x => (
                    <FormField key={x}>
                        <Checkbox
                            radio
                            label={x}
                            name='status'
                            value={x}
                            checked={status === x}
                            onChange={this.handleChange}
                        />
                    </FormField>
                ))}
            </div>
        )
    }
}