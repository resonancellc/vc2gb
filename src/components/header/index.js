import { h, Component } from 'preact';
import { route } from 'preact-router';
import Toolbar from 'preact-material-components/Toolbar';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
// import style from './style';

export default class Header extends Component {
  closeDrawer() {
    this.drawer.MDComponent.open = false;
    this.state = {
      darkThemeEnabled: false
    };
  }

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = path => () => {
	  route(path);
	  this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');

	toggleDarkTheme = () => {
	  this.setState(
	    {
	      darkThemeEnabled: !this.state.darkThemeEnabled
	    },
	    () => {
	      if (this.state.darkThemeEnabled) {
	        document.body.classList.add('mdc-theme--dark');
	      }
	      else {
	        document.body.classList.remove('mdc-theme--dark');
	      }
	    }
	  );
	}

	render() {
	  return (
	    <div>
	      <Toolbar className="toolbar">
	        <Toolbar.Row>
	          <Toolbar.Section align-start>
	            <Toolbar.Title>Welcome to vc2gb!</Toolbar.Title>
	          </Toolbar.Section>
	          <Toolbar.Section align-end onClick={this.openSettings}>
	            <Toolbar.Icon>settings</Toolbar.Icon>
	          </Toolbar.Section>
	        </Toolbar.Row>
	      </Toolbar>
	      <Dialog ref={this.dialogRef}>
	        <Dialog.Header>Settings</Dialog.Header>
	        <Dialog.Body>
	          <div>
							Enable dark theme <Switch onClick={this.toggleDarkTheme} />
	          </div>
	        </Dialog.Body>
	        <Dialog.Footer>
	          <Dialog.FooterButton accept>okay</Dialog.FooterButton>
	        </Dialog.Footer>
	      </Dialog>
	    </div>
	  );
	}
}
