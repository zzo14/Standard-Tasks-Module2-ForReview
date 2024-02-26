import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon, Grid, GridRow, GridColumn, Button } from 'semantic-ui-react'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfile: false
        };
        this.toggleProfile = this.toggleProfile.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
    };

    toggleProfile() {
        this.setState({
            showProfile: !this.state.showProfile
        });
    }


    render() {
        const { name, photoId, videoUrl, cvUrl, summary, currentEmployment, visa, skills, level } = this.props.talent;
        const { showProfile } = this.state;
        return (
            <div className="ui card talent-card">
                <div className="content">
                    <div>
                        {name}
                        <Icon className="ui right floated" name='star' />
                    </div>
                </div>
                {showProfile ? this.renderProfile() :
                    <div>
                        <video className="content-video" controls>
                            <source src={videoUrl} />
                        </video>
                    </div>
                }
                <div className="extra content">
                    <div>
                        <Grid className="center aligned" columns='equal'>
                            <GridRow>
                                <GridColumn>
                                    {showProfile ? <Icon color='black' name="video camera" onClick={() => this.toggleProfile()} /> : <Icon color='black' name="user" onClick={() => this.toggleProfile()} />}
                                </GridColumn>
                                <GridColumn>
                                    <Icon color='black' name="file pdf outline" />
                                </GridColumn>
                                <GridColumn>
                                    <Icon color='black' name="linkedin" />
                                </GridColumn>
                                <GridColumn>
                                    <Icon color='black' name="github" />
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    </div>
                </div>
                <div className="extra content">
                    <div>
                        {skills.length > 0 ? skills.map((skill, index) => {
                            return (
                                <Popup
                                    key={index}
                                    trigger={<Button basic color='blue'>{skill}</Button>}
                                    content={skill}
                                    position='top center'
                                />
                            )
                        }) : "Have no skills"}
                    </div>
                </div>
            </div>
        )
    }

    renderProfile() {
        if (!this.props.talent) {
            return null;
        }
        const { name, photoId, videoUrl, cvUrl, summary, currentEmployment, visa, skills, level } = this.props.talent;
        const job = currentEmployment.split("at");
        const companyName = job[1];
        const position = job[0];

        return (
            <div className="content">
                <Grid columns='equal' className="talent-snapshot">
                    <GridColumn width={8} className="image-column">
                        {photoId ? <img src={photoId} alt="Profile" className="ui image image-talent" />
                            :
                            <img src="https://react.semantic-ui.com/images/avatar/large/matthew.png" alt="Profile" className="ui image image-talent" />}
                    </GridColumn>
                    <GridColumn width={8}>
                        <div className="talent-detail-snapshot">
                            <p className="header"><strong>Talent snapshot</strong></p>
                        </div>
                        <br />
                        <div>
                            <p><strong>CURRENT EMPLOYER</strong></p>
                            {companyName ? companyName : "Not available"}
                        </div>
                        <div>
                            <p><strong>VISA STATUS</strong></p>
                            {visa ? visa : "Not available"}
                        </div>
                        <div>
                            <p><strong>POSITION</strong></p>
                            {position ? position : "Not available"}
                        </div>
                    </GridColumn>
                </Grid>
            </div>
        )
    }
}

