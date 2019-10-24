import React, { Component } from 'react'
import { View, Text } from 'react-native'

class LocationElement extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<View>
				<Text> {JSON.stringify(this.props.locationData, null, 4)} </Text>
			</View>
		)
	}
}

export default LocationElement
