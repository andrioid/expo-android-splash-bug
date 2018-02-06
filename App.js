import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Permissions, Notifications } from 'expo'

const registerForPush = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return // We can't continue without permission
  }

  Notifications.addListener(notification => {
    dispatch(receivePushNotification(notification))
    console.log('received push notification', notification)
  })
  try {
    const token = await Notifications.getExpoPushTokenAsync()
    return token
  } catch (err) {
    console.error(err)
  }
  return
}


export default class App extends React.Component {
  componentDidMount() {
    registerForPush()
      .then((token) => {
        this.setState({ ready: true, token })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  state = { ready: false, token: '' }
  render() {
    if (!this.state.ready) {
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <Text>Main screen turn-on!</Text>
        <Text>All your base are belong to us!</Text>
        <Text>{this.state.token}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
