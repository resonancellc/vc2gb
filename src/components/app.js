import { h, Component } from 'preact';
import { Router, Route } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
	  this.currentUrl = e.url;
	};

	render() {
	  return (
	    <div id="app">
	      <Header />
	      <Router onChange={this.handleRoute}>
	        <Route path="/" component={Home} />
	        <Route path="/vc2gb/" component={Home} />
	      </Router>
	    </div>
	  );
	}
}
