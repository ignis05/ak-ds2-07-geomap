import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	wrapper: { flex: 1 },
	button: { fontSize: 24, fontWeight: 'bold' },
})

class LocationList extends Component {
	static navigationOptions = {
		title: 'locations',
		headerStyle: {
			backgroundColor: 'cyan',
		},
		headerTitleStyle: {
			color: '#ffffff',
		},
	}

	constructor(props) {
		super(props)
		this.state = { locations: [] }
	}

	render() {
		return (
			<View style={styles.wrapper}>
				{this.state.locations.length > 0 ? (
					<FlatList
						style={styles.list}
						data={this.state.locations}
						keyExtractor={item => item.username}
						renderItem={({ item, index }) => (
							<UserListElement
								username={item.username}
								password={item.password}
								changeView={this.changeView}
								deleteUser={this.deleteUser}
								highlighted={index % 2 == 0 ? true : false}
								index={index}
							/>
						)}
						onRefresh={this.refresh}
						refreshing={this.state.refreshing}
					/>
				) : (
					<Text>Loading data</Text>
				)}
			</View>
		)
	}
}

export default LocationList
