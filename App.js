import React, {Component,PureComponent} from 'react';
import {ButtonGroup, Header, Icon, Avatar } from 'react-native-elements';
import { Text, View, FlatList,ActivityIndicator, TouchableOpacity   } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator  } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import  MapView, { Marker }  from 'react-native-maps'; 
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import moment from 'moment';

class Events extends PureComponent {
  constructor(props){
    moment.locale('fr');
    super(props);
    this.state = {posts :  [], DaysIndex : 0, loading : true}
  }

  componentDidMount(){
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(json => {
        this.setState({posts : json, loading : false})
    })
  }

  updateDaysIndex = (selectedIndex) =>{
    this.setState({DaysIndex : selectedIndex , loading : true});
    fetch('https://jsonplaceholder.typicode.com/posts?userId='+(selectedIndex+3))
    .then(response => response.json())
    .then(json => {
        this.setState({posts : json, loading : false})
    })
  }

  render =  () =>{
    const {posts, loading} = this.state;
    return (
    <View style = {{flex :1, backgroundColor : '#fff'}}>
      <ButtonGroup
          onPress = {this.updateDaysIndex}
          selectedIndex = {this.state.DaysIndex}
          buttons={['Jour 1', 'Jour 2', 'Jour 3']}
          selectedButtonStyle = {{backgroundColor : '#7bdfa0'}}
          selectedTextStyle = {{fontWeight : 'bold', fontSize : 16}}
        />

      { 
        (loading )? 
                    <View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}  >
                      <ActivityIndicator  size='large' color="#7bdfa0" /> 
                    </View>
                  :
                    <FlatList 
                        data = {posts}
                        keyExtractor = {(item)=>  item.id+''}
                        renderItem = { ({item}) => <EventItem item={item} {...this.props} />} />
      }
        

    </View>
    );
  }

}

class EventItem extends PureComponent{

  constructor(props){super(props)}

  render = () => {
    const {item} = this.props;
    return (
        <TouchableOpacity  onPress = {() => this.props.navigation.navigate('EventDetaille', {id : item.id, title : 'Math Kendy'})}>
        <View style={{flex:1, flexDirection : 'row', marginVertical:10,minHeight: 250, marginHorizontal: 10, borderColor : '#dbdbdb', borderWidth : 1}} >
            <View style={{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:'#ededed', paddingHorizontal : 8}}>
              <Text style={{fontSize:35,marginBottom : 2}}>{moment(new Date()).format("DD")} </Text>
              <Text style={{fontSize:19,marginBottom : 5}}>{moment(new Date()).format("MMM")} </Text>
              <View style={{flexDirection : 'row',marginBottom : 5}}>
                  <Icon style={{fontSize : 5}} name='clock-o' type='font-awesome'/>
                  <Text style={{fontWeight : 'bold'}}> {moment(new Date()).format("h:mm:ss")} </Text>
              </View>
            </View>

            <View style={{flex:2, justifyContent : 'space-around',paddingHorizontal : 10}}>
              <View >
                <Text style={{marginBottom : 10, fontSize:17, fontWeight : 'bold', textTransform : 'capitalize'}}>{item.title}</Text>
                <Text style={{textAlign : 'justify', color : '#666666'}}>{item.body.substring(1,200).concat(' ', '...')}</Text>
              </View>
              <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                  <View style = {{flexDirection : 'row'}}>
                      <Icon color='#bcacaf' name='map-marker' type='font-awesome'/>
                      <Text style={{marginLeft : 10}}>Place Rachedi</Text>
                  </View>
                  <Avatar size="small" source={{ uri:'https://randomuser.me/api/portraits/men/'+item.id+'.jpg'}} rounded />
              </View>
            </View>

        </View>
        </TouchableOpacity >
    );
  }
}

class LeftNavigation extends PureComponent{

  constructor(props){super(props)}

  render = () => {
    return (
      <View>
        <Icon name='arrow-left' color="#fff" type='font-awesome' onPress={() => this.props.navigation.goBack()} />
      </View>
    );
  }
}

class EventDetaille extends PureComponent{
  static navigationOptions = {
    title: 'Artists',
  };
  constructor(props){
    super(props);
    this.state = {post : {}}
  }

  componentDidMount = () =>{
    const {navigation} = this.props;
    fetch('https://jsonplaceholder.typicode.com/posts/'+navigation.getParam('id'))
    .then(response => response.json())
    .then(json => {
        this.setState({post : json})
    })
  }

  componentWillUnmount = () =>{
    this.setState({post : {}})
  }

  render = () => {
    const {post} = this.state
    const title = 'Bridget Anderson';
    return (
        <View style={{flex:1, backgroundColor: '#fff'}}>
            <ScrollView>
  
                <View style={{ alignItems : 'center'}}>
                  <Avatar size="xlarge" containerStyle = {{borderWidth : 3, borderColor : '#ccc', marginBottom:5}} source={{ uri:'https://randomuser.me/api/portraits/men/'+post.id+'.jpg'}} rounded />
                  <Text style = {{fontSize : 18, textAlign: 'justify', marginBottom : 10}}>Bridget Anderson</Text>
                </View>
  
                <View style={{ paddingHorizontal : 20, paddingVertical : 10}}>
                  
                  <Text style = {{marginBottom : 10, fontSize:17, fontWeight : 'bold', textTransform : 'capitalize'}}>{post.title}</Text>
  
                  <View style={{padding : 25, borderColor:'#bcacaf', borderWidth:2, marginTop : 10, flexDirection : 'row'}} >
                    <Icon color='#bcacaf' name='clock-o' type='font-awesome'/>
                    <Text style={{fontSize : 18, marginLeft : 20}}>Commence à 17 : 20</Text>
                  </View>
  
                  <View style={{marginVertical: 10,  padding : 10, borderColor:'#bcacaf', borderWidth:2}}>
                <Text style = {{fontSize : 17,marginBottom : 10 }}>{post.body}</Text>
                  </View>
  
                  <View style = {{flexDirection : 'row', padding : 25, borderColor:'#bcacaf', borderWidth:2}}>
                      <Icon color='#bcacaf' name='map-marker' type='font-awesome'/>
                      <Text style = {{fontSize : 16, marginLeft : 20}}>Scene 35 : Marie Lux</Text>
                     
                  </View>

                  <View style={{flex:1,marginTop:10, borderColor:'#bcacaf', borderWidth:1}}>
                    <MapView style={{height:350}}
                            showsUserLocation
                            loadingEnabled
                            initialRegion={{
                              latitude: 37.78825,
                              longitude: -122.4324,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }}
                          >
                      <Marker
                            coordinate={{latitude: 37.78825,longitude: -122.4324}}
                            title={post.title}
                            description={post.body}
                        />
                  </MapView>
                  </View>

                  
  
                </View>
  
              </ScrollView>
          </View>
      )
  }
}

class Artists extends PureComponent{
  
    constructor(props){
      super(props);
    }

    componentDidMount(){
    const { status } = Permissions.askAsync(Permissions.NOTIFICATIONS);
    // if (status !== 'granted') {
    //   alert('No notification permissions!');
    //   return;
    // }
    let token = Notifications.getExpoPushTokenAsync();
    console.log(token)
  }


  render = () => {
    return (<View><Text>Artists</Text></View>);
  }


}



// Configuration Tabs et Main View
const eventStack = createStackNavigator({
  Events: {
    screen: Events,
    navigationOptions: ({ navigation }) => ({
      title: 'Evenements',
      headerStyle: {
        backgroundColor: '#7bdfa0',
        height: 50,
      },
      header: ({ scene, previous, navigation }) => {
        const { options } = scene.descriptor;
        const title =
          options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : scene.route.routeName;
      
        return (
          <Header
              centerComponent={{ text: title, style: { color: '#fff', fontWeight: 'bold', fontSize:18 } }}
              containerStyle={{
                backgroundColor: '#5fd2a1',
                justifyContent: 'space-around',
              }}
            />
        );
      } 
    }),
  },
  EventDetaille : {
    screen : EventDetaille,
    navigationOptions: ({ navigation }) => ({
      title: 'Evenements '+navigation.getParam('title'),
      headerStyle: {
        backgroundColor: '#7bdfa0',
        height: 50,
      },
      header: ({ scene, previous, navigation }) => {
        const { options } = scene.descriptor;
        const title =
          options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : scene.route.routeName;
      
        return (
          <Header
              leftComponent={<LeftNavigation navigation = {navigation} />}
              centerComponent={{ text: title, style: { color: '#fff', fontWeight: 'bold', fontSize:18 } }}
              containerStyle={{
                backgroundColor: '#5fd2a1',
                justifyContent: 'space-around',
              }}
            />
        );
      } 
    }),
  }
});

const AppNavigator = createBottomTabNavigator({
      Events: eventStack,
      Artists : Artists
  },{
      initialRouteName : 'Events',
      tabBarOptions: {
        activeTintColor: '#38c3a4',
        inactiveTintColor: 'gray',
        showIcon : false,
        labelStyle: {
          fontSize: 18,
          fontWeight : 'bold'
        },
        style: {
          alignItems : 'center' 
        }
      }
  }
);

const AppContainer = createAppContainer(AppNavigator);
export default class App extends Component {
  state = {
    notification: {},
  };

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <AppContainer />
      </View>
    );
  }
}
