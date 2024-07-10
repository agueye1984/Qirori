import {Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {LargeButton} from './LargeButton';

interface Props {
  body: string;
  actionLabel: string;
  action: () => void;
}

export const EmptyList = ({body, actionLabel, action}: Props) => {
  const defaultStyles = DefaultComponentsThemes();
  return (
    <View style={{justifyContent: 'center', alignContent: 'center'}}>
      <Text
        style={[
          defaultStyles.text,
          {
            marginVertical: 50,
            paddingHorizontal: 10,
            textAlign: 'center',
          },
        ]}>
        {body}
      </Text>
      <LargeButton isPrimary title={actionLabel} action={action} />
    </View>
  );
};
