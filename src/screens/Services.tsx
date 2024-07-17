import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {useNavigation} from '@react-navigation/native';
import {Service, User} from '../contexts/types';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {EmptyList} from '../components/EmptyList';
import ServiceLists from '../components/ServiceLists';
import storage from '@react-native-firebase/storage';

export const Services = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [service, setService] = useState<Service[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  useEffect(() => {
    firestore()
      .collection('services')
      .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setService([]);
        } else {
          const services: Service[] = [];
          querySnapshot.forEach(documentSnapshot => {
            services.push(documentSnapshot.data() as Service);
          });
          setService(services);
        }
      });
  }, [userId]);

/*   useEffect(() => {
    const image: string[] = [];
    service.map((item: Service, index: number) => {
      
    storage().ref(item.images).getDownloadURL().then(url => image.push(url));
   console.log(image)
    })
    setImages(image);
  }, [service]); */


  console.log(service)

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('Services.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        {service.length === 0 && (
          <EmptyList
            body={t('Services.EmptyList')}
            actionLabel={t('AddService.title')}
            action={() => navigation.navigate('AddService' as never)}
          />
        )}
        <ScrollView style={{padding: 10}} scrollEnabled>
          {service.map((item: Service, index: number) => {
            return (
              <ServiceLists
                key={index.toString()}
                service={item}
                color={theme.colors.black}
              />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
