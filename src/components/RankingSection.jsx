import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import Button from './Button';
import Message from './Message';
import RankingItem from './RankingItem';
import Section from './Section';
import TabBar from './TabBar';

export default function RankingSection({ title, subtitle, periods, period, onPeriodChange, items, loading, error, onRefresh }) {
  return (
    <Section title={title} subtitle={subtitle}>
      <TabBar tabs={periods} active={period} onChange={onPeriodChange} />
      {loading ? <ActivityIndicator color={colors.accent} /> : null}
      <Message type="error" text={error} />
      {!loading && !error && items.length === 0 ? (
        <Text style={styles.empty}>Ainda não há escutas neste período. Registre uma na aba Escutar.</Text>
      ) : null}
      <View style={styles.list}>
        {items.map((item) => (
          <RankingItem
            key={item.trackId}
            rank={item.rank}
            name={item.trackName}
            artistName={item.artistName}
            timesListened={item.timesListened}
            minutes={item.totalMinutes}
          />
        ))}
      </View>
      <Button title="Atualizar" variant="secondary" onPress={onRefresh} disabled={loading} />
    </Section>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: spacing.sm,
  },
});
