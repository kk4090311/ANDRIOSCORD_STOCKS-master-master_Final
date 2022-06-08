import React, { useCallback, useRef} from 'react';
import { View, Text, StyleSheet, LogBox, ScrollView, SafeAreaView, RefreshControl} from 'react-native';
import Watchlist from '../components/Watchlist';
import Favlist from '../components/Favlist';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { FavlistState } from '../store/reducers/favlist';
import { WatchlistState } from '../store/reducers/watchlist';
import { TopMoversState } from '../store/reducers/topmovers';
import Colors from '../constants/Colors';
import * as favlistActions from '../store/actions/favlist';
import * as watchlistActions from '../store/actions/watchlist';
import * as topMoversActions from '../store/actions/topmovers';
import * as newsActions from '../store/actions/news';

import { useScrollToTop } from '@react-navigation/native';
import { NewsState } from '../store/reducers/news';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux'
import { store } from '../store/Store';
import { useColorMode } from 'native-base';

interface RootState {
  favlist: FavlistState;
  watchlist: WatchlistState;
  topMovers: TopMoversState;
  news: NewsState;
}


const Portfolio = () => {
  const favlistData = useSelector(
    (state: RootState) => state.favlist.favlistData
  );
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const loadData = useCallback(async () => {
    try {
      dispatch(favlistActions.fetchCoinData());
      dispatch(watchlistActions.fetchCoinData());
      dispatch(topMoversActions.fetchTopMoversData());
      dispatch(newsActions.fetchNewsData());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    loadData();
  }, [loadData]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().then(() => {
      setRefreshing(false);
    });
  }, [loadData, refreshing]);

  const ref = useRef(null);
  useScrollToTop(ref);


  const { colorMode } = useColorMode();
  const styles = colorMode == 'dark' ? stylesDark : stylesLight;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
        ref={ref}
        refreshControl={
          <RefreshControl
            tintColor='rgb(233, 233, 243)'
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Favlist stockData={favlistData} coinData={favlistData}/>
        <StatusBar style='auto' />
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightColor.homeBackground,
    justifyContent: 'flex-start', 
  },
  image: {
    height: 250,
    width: 150,
    marginTop: 40,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 21,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 24,
    color: Colors.lightColor.subtitle,
  },
});


const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkColor.homeBackground,
    justifyContent: 'flex-start', 
  },
  image: {
    height: 250,
    width: 150,
    marginTop: 40,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 21,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 24,
    color: Colors.darkColor.subtitle,
  },
});

export default Portfolio;
