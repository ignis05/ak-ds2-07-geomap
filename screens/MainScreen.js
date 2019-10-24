import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Button from '../components/Button'
import * as Font from 'expo-font'

const styles = StyleSheet.create({
	wrapper: { flex: 1 },
	header: { flex: 1, backgroundColor: 'cyan', alignItems: 'center', justifyContent: 'center' },
	headerText: { fontSize: 48, color: 'black', textAlign: 'center' },
	buttonWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	button: { fontSize: 24, fontWeight: 'bold' },
})

class MainScreen extends Component {
	static navigationOptions = {
		header: null,
	}

	constructor(props) {
		super(props)
		this.state = { fontLoaded: false }

		this.navigate = this.navigate.bind(this)
	}

	navigate() {
		this.props.navigation.navigate('locations')
	}

	async componentWillMount() {
		await Font.loadAsync({
			customFont: require('../assets/fonts/FiraCode-Regular.ttf'),
		})
		this.setState({ fontLoaded: true })
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<View style={styles.header}>
					<Text style={[styles.headerText, this.state.fontLoaded ? { fontFamily: 'customFont' } : {}]}>GeoMap App</Text>
					<Text>find and save your position</Text>
				</View>
				<View style={styles.buttonWrapper}>
					<Button style={styles.button} onTouch={this.navigate}>
						Start
					</Button>
				</View>
			</View>
		)
	}
}

export default MainScreen
