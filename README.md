
## React Site Announcement

This component is used to display website wide announcements like latest features pushed on the top.It uses react-draft-wysiwyg rich text content to edit and display text.

## Using the Component

To be able to use the component, follow the steps below:

- Install react-site-announcement in your application, this will install the latest release:
`npm i react-site-announcement@latest --save`

- Import the component:
`import { ReactSiteAnnouncement } from 'react-site-announcement'`
<CommonApplicationAlert isAdmin data={this.state.alertData} saveMessage={this.putMessage}/> }
## PROPS
 There are 4 methods under the snackToast API.
 1) isAdmin - A flag to indicate if the logged in user can edit the message.If this flag is set to yes , user can edit existing text , add new text, If set to false user will only be able to see the text.
 2) data - Accepts rich html text as input ,for eg: "{&#34;blocks&#34;:[{&#34;key&#34;:&#34;13trq&#34;,&#34;text&#34;:&#34;Important message!&#34;,&#34;type&#34;:&#34;unstyled&#34;,&#34;depth&#34;:0,&#34;inlineStyleRanges&#34;:[],&#34;entityRanges&#34;:[],&#34;data&#34;:{}}],&#34;entityMap&#34;:{}}"
 3) saveMessage - A function as callback that will be responsible for saving the messages to the backend , for eg:
 `handleMessage=async (message) => {
      await saveMessageToBackend(message);
    }`
 
        
     
## Example
     <ReactSiteAnnouncement isAdmin={true} data={this.state.alertData} saveMessage={this.handleMessage}/> 
