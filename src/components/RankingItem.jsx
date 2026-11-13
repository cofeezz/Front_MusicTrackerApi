import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function RankingItem({ rank, name, artistName, timesListened, minutes }) {
  return (
    <View style={styles.row}>
      <View style={[styles.badge, rank === 1 && styles.badgeFirst]}>
        <Text style={styles.badgeText}>{rank}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artistName}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.count}>{timesListened}x</Text>
        <Text style={styles.minutes}>{minutes} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },
  badgeFirst: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    color: colors.text,
    fontWeight: '700',
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
  stats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  count: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  minutes: {
    color: colors.muted,
    fontSize: 12,
  },
});
