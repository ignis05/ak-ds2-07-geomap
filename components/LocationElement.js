import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Switch } from 'react-native'
import img from '../assets/images/location.png'

const styles = StyleSheet.create({
	wrapper: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 },
	img: { width: 40, height: 40, marginRight: 10, resizeMode: 'contain' },
	smallText: { fontSize: 12, color: '#888888' },
})

class LocationElement extends Component {
	constructor(props) {
		super(props)

		this.switchHandler = this.switchHandler.bind(this)
	}

	switchHandler(val) {
		this.props.callback(this.props.locationData.key, val)
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<Image source={img} alt="" style={styles.img} />
				<View>
					<Text>Timestamp: {new Date(this.props.locationData.value.timestamp).toLocaleString('en-GB')}</Text>
					<Text style={styles.smallText}>Latitude: {this.props.locationData.value.coords.latitude}</Text>
					<Text style={styles.smallText}>Longitude: {this.props.locationData.value.coords.longitude}</Text>
				</View>
				<Switch value={this.props.locationData.selected} onValueChange={this.switchHandler} />
			</View>
		)
	}
}

export default LocationElement
