import React, { Component } from 'react';
import { Image, Button, Icon, GridRow, GridColumn, Grid } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPhoto: this.props.imageId || "",
            previewUrl: this.props.imageId || "",
            fileInput: React.createRef(),
            showUploadButton: false
        };

        this.triggerFileInput = this.triggerFileInput.bind(this);
        this.handlePhotoChange = this.handlePhotoChange.bind(this);
        this.savePhoto = this.savePhoto.bind(this);
        this.saveFunction = this.saveFunction.bind(this);
    }

    triggerFileInput() {
        this.state.fileInput.current.click();
    }

    handlePhotoChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            this.setState({
                newPhoto: file,
                previewUrl: previewUrl,
                showUploadButton: true
            });
        }
    }


    savePhoto() {
        this.props.updateProfileData(this.state.newPhoto);
        this.setState({ showUploadButton: false }, this.saveFunction);
    }

    saveFunction() {
        let photo = this.state.newPhoto;
        console.log('Photo to be uploaded:', photo);
        const data = new FormData();
        data.append('file', photo); 

        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            processData: false, 
            contentType: false, 
            type: "POST",
            data: data,
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Photo updated sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Photo did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
                TalentUtil.notification.show("Photo did not update successfully", "error", null, null)
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.imageId !== prevProps.imageId) {
            this.setState({
                newPhoto: this.props.imageId || "" ,
                previewUrl: this.props.imageId || ""
            });
        }
    }

    render() {
        const showUploadButton = this.state.showUploadButton;
        const previewUrl = this.state.previewUrl;

        return (
            <div className='ui sixteen wide column'>
                <Grid columns='equal'>
                    <GridRow>
                        <GridColumn>
                            {previewUrl ? (
                                <div className="image-preview" onClick={this.triggerFileInput}>
                                    <Image
                                        src={previewUrl}
                                        className="ui small image"
                                    />
                                </div>
                            ) : (
                                <div className="image-preview" onClick={this.triggerFileInput}>
                                    <Icon
                                        name='camera retro'
                                        size='huge'
                                        className='icon-circle'
                                    />
                                </div>
                            )}
                            <input
                                type='file'
                                ref={this.state.fileInput}
                                style={{ display: 'none' }}
                                onChange={this.handlePhotoChange}
                                accept='image/*'
                            />
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn className="upload-button-container">
                            {showUploadButton && (
                                <Button color='black' className='upload-button' onClick={this.savePhoto}>
                                    <Icon name='upload' />
                                    Upload
                                </Button>
                            )}
                        </ GridColumn>
                    </GridRow>
                </Grid>
            </div>
        );
    }
}
