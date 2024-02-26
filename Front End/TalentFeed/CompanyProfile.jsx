import React from 'react';
import { Loader, Image,Icon } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {  
        const { companyDetails } = this.props;
        const { name, location, phone, email } = companyDetails ? companyDetails.companyContact : {};
        const { skills, profilePhotoUrl } = companyDetails ? companyDetails : {};
        const avatarUrl = profilePhotoUrl ? profilePhotoUrl : 'https://react.semantic-ui.com/images/wireframe/square-image.png';

        return (
            <div className="ui card">
                <div className="content">
                    <div className="center aligned author">
                        <Image src={ avatarUrl } size='tiny' circular />
                    </div>
                    <br />
                    <div className="center aligned header">
                        {name}
                    </div>
                    <div className="center aligned meta">
                        <Icon name="point" color="grey" />
                        {location ? location.city : "City"}, {location ? location.country : "Country"}
                    </div>
                    <div className="center aligned description">
                        {skills && skills.length > 0 ? skills.join(', ') : 'We currently do not have specific skills that we desire.'}
                    </div>
                </div>
                <div className="extra content">
                    <div>
                        <Icon name="phone" /> :{' '}
                        {phone}
                    </div>
                    <div>
                        <Icon name="mail" /> :{' '}
                        {email}
                    </div>
                </div>
            </div>
        )
    }
}