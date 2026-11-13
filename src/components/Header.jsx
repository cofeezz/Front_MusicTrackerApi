import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import Button from './Button';

export default function Header({ title, username, onLogout }) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {username ? <Text style={styles.user}>Olá, {username}</Text> : null}
      </View>
      {username ? <Button title="Sair" variant="ghost" onPress={onLogout} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  user: {
    color: colors.muted,
    fontSize: 14,
  },
});
