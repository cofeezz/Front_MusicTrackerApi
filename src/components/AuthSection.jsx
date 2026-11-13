import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import Button from './Button';
import Message from './Message';
import Section from './Section';
import TextField from './TextField';

export default function AuthSection({ title, subtitle, loading, error, notice, onLogin, onRegister }) {
  const [creating, setCreating] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (creating) {
      onRegister({ username: username.trim(), email: email.trim(), password });
    } else {
      onLogin({ username: username.trim(), password });
    }
  };

  return (
    <Section title={creating ? 'Criar conta' : title} subtitle={subtitle}>
      <TextField label="Nome de usuário" value={username} onChangeText={setUsername} placeholder="ex: cofeezz" />
      {creating ? (
        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
        />
      ) : null}
      <TextField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="mínimo de 6 caracteres"
        secureTextEntry
      />
      <Message type="info" text={notice} />
      <Message type="error" text={error} />
      <View style={styles.actions}>
        <Button title={creating ? 'Criar conta e entrar' : 'Entrar'} onPress={submit} loading={loading} />
        <Button
          title={creating ? 'Já tenho conta' : 'Criar uma conta'}
          variant="ghost"
          onPress={() => setCreating(!creating)}
          disabled={loading}
        />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
  },
});
