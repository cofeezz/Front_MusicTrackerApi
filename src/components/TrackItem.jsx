import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function TrackItem({ name, artistName, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.row, selected && styles.rowSelected]}>
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artistName}</Text>
      </View>
      {selected ? <Text style={styles.check}>Selecionada</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  rowSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    color: colors.muted,
    fontSize: 13,
  },
  check: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
