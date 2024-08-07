import React from 'react';
import {View} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Label} from './Label';

type Props = {
  heading?: string;
  rightLabel?: string;
  renderRight?: () => React.ReactNode;
  subLabel?: string;
};

export const TitleComp = ({
  heading,
  rightLabel,
  renderRight,
  subLabel,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{}}>
        <Label
          text={heading}
          style={{fontSize: scale(20), fontWeight: '600'}}
        />
        {subLabel && (
          <Label
            text={subLabel}
            style={{
              fontSize: scale(12),
              opacity: scale(0.5),
              marginTop: scale(10),
            }}
          />
        )}
      </View>
      {!renderRight && rightLabel && (
        <Label text={rightLabel} style={{fontSize: scale(14)}} />
      )}
      {renderRight && renderRight()}
    </View>
  );
};
