import React from 'react';
import { Navigation } from '../types';
import { Container } from '../components/Container';
import { SearchBox } from '../components/SearchBox';

type Props = {
    navigation: Navigation;
  };

export const Search = ({navigation}: Props) => {
    console.log({navigation});

    const searchProduct= () =>{

    }
  return (
    <Container>
      <SearchBox onFoucs={searchProduct} rightIcon={"x"} autoFocus onRightIconPress={()=>{ 
        navigation.navigate("BuyProduct") }}  />
    </Container>
  );
}
