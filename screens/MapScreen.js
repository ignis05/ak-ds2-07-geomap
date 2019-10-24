import React, { Component } from 'react'
import { View } from 'react-native'
import MapView from 'react-native-maps'

class MapScreen extends Component {
	static navigationOptions = {
		title: 'map',
		headerStyle: {
			backgroundColor: 'cyan',
		},
		headerTitleStyle: {
			color: '#000000',
		},
	}

	constructor(props) {
		super(props)
		this.state = {}

		try {
			this.markers = this.props.navigation.state.params.markers
		} catch {
			this.markers = []
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<MapView
					style={{ flex: 1 }}
					initialRegion={{
						latitude: this.markers.length > 0 ? this.markers[0].value.coords.latitude : 50.111,
						longitude: this.markers.length > 0 ? this.markers[0].value.coords.longitude : 20.111,
						latitudeDelta: 0.001,
						longitudeDelta: 0.001,
					}}
				>
					{this.markers.map(marker => (
						<MapView.Marker
							key={marker.key}
							coordinate={{
								latitude: marker.value.coords.latitude,
								longitude: marker.value.coords.longitude,
							}}
							title={marker.key}
							description={new Date(marker.value.timestamp).toLocaleString('en-GB')}
						/>
					))}
				</MapView>
			</View>
		)
	}
}

export default MapScreen
