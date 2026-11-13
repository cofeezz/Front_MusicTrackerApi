import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function Section({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  heading: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    gap: spacing.md,
  },
});
