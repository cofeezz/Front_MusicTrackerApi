import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

const tones = {
  error: colors.danger,
  success: colors.success,
  info: colors.muted,
};

export default function Message({ type = 'info', text }) {
  if (!text) {
    return null;
  }
  return (
    <View style={[styles.box, { borderColor: tones[type] }]}>
      <Text style={[styles.text, { color: tones[type] }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surfaceAlt,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
