import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null,
            loadingFeedData: false
        }

        this.init = this.init.bind(this);
        this.loadCompanyData = this.loadCompanyData.bind(this);
        this.loadData = this.loadData.bind(this);
        this.updateWithoutSaveCompany = this.updateWithoutSaveCompany.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.init();
        this.loadCompanyData();
        this.loadData();
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    loadCompanyData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofile20240221234249.azurewebsites.net/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let companyDetails = null;
                if (res.employer) {
                    companyDetails = res.employer
                }
                this.updateWithoutSaveCompany(companyDetails)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
        this.init()
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        const { loadNumber, loadPosition } = this.state;
        $.ajax({
            url: `https://talentservicesprofile20240221234249.azurewebsites.net/profile/profile/getTalent?Position=${loadPosition}&Number=${loadNumber}`,
            headers: {

                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                //if (res.data) {
                //    this.setState({ feedData: res.data }, () => {
                //        console.log("feedData", this.state.feedData);
                //    });
                //}
                let talentDetails = null;
                if (res.data) {
                    talentDetails = res.data
                }
                this.updateWithoutSave(talentDetails)
            }.bind(this),
            error: function (error) {
                this.setState({
                    loadingFeedData: false
                });
                console.log(error)
            }
        })
        this.init()
    }

    //updates component's state without saving data
    updateWithoutSaveCompany(newData) {
        this.setState({
            companyDetails: newData
        })
    }

    //updates component's state without saving data
    updateWithoutSave(newData) {
        console.log('New data:', newData);
        this.setState(prevState => ({
            loadingFeedData: false,
            feedData: prevState.feedData.concat(newData ? newData : []),
            loadPosition: prevState.loadPosition + prevState.loadNumber
        }));
    }


    handleScroll() {
        const win = $(window);
        if (!this.state.loadingFeedData &&
            ((($(document).height() - win.height()) == Math.round(win.scrollTop())) || ($(document).height() - win.height()) - Math.round(win.scrollTop()) == 1)) {
            $("#load-more-loading").show();
            //load ajax and update states
            //call state and update state;
            this.setState({
                loadingFeedData: true,
            }, () => {
                this.loadData();
            });
        }
    };


    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile
                            companyDetails={this.state.companyDetails} />
                    </div>
                    <div className="eight wide column">
                        {this.state.feedData && this.state.feedData.length > 0 ?
                            this.state.feedData.map((talent, index) => {
                                return (
                                    <TalentCard key={index} talent={talent} />
                                )
                            }) :
                            <div className="text center">
                                <span><strong>There are no talents found for your recruitment company</strong></span>
                            </div>
                        }
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}