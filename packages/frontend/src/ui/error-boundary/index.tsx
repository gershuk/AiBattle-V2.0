import { Component } from 'preact'

export class ErrorBoundary extends Component {
	state = { error: null }

	static getDerivedStateFromError(error: { message: any }) {
		return { error: error.message }
	}

	componentDidCatch(error: { message: any }) {
		console.error(error)
		this.setState({ error: error.message })
	}

	render() {
		if (this.state.error) {
			return <p>Oh no! We ran into an error: {this.state.error}</p>
		}
		return this.props.children
	}
}
