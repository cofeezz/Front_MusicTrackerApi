import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import ArtistPicker from './ArtistPicker';
import Button from './Button';
import Message from './Message';
import Section from './Section';
import TextField from './TextField';
import TrackItem from './TrackItem';

export default function ListenSection({
  title,
  subtitle,
  genres,
  onSearch,
  onSearchArtists,
  onCreateArtist,
  onCreateTrack,
  onRegister,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [seconds, setSeconds] = useState('180');
  const [showNew, setShowNew] = useState(false);
  const [artist, setArtist] = useState(null);
  const [trackName, setTrackName] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: 'info', text: '' });

  const run = async (action) => {
    setBusy(true);
    setFeedback({ type: 'info', text: '' });
    try {
      await action();
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const search = () =>
    run(async () => {
      if (!query.trim()) {
        throw new Error('Digite o nome da música para buscar.');
      }
      setResults(await onSearch(query.trim()));
    });

  const createTrack = () =>
    run(async () => {
      if (!artist) {
        throw new Error('Escolha primeiro o artista da música.');
      }
      if (!trackName.trim()) {
        throw new Error('Informe o nome da música.');
      }
      const track = await onCreateTrack({ artistId: artist.id, artistName: artist.name, trackName: trackName.trim() });
      setSelected(track);
      setResults(null);
      setShowNew(false);
      setArtist(null);
      setTrackName('');
      setFeedback({ type: 'success', text: 'Música cadastrada e selecionada. Agora é só registrar a escuta.' });
    });

  const register = () =>
    run(async () => {
      const duration = Number(seconds);
      if (!Number.isInteger(duration) || duration <= 0) {
        throw new Error('A duração deve ser um número inteiro de segundos, maior que zero.');
      }
      await onRegister({ trackId: selected.id, durationSeconds: duration });
      setFeedback({ type: 'success', text: `Escuta de "${selected.name}" registrada.` });
    });

  return (
    <Section title={title} subtitle={subtitle}>
      <TextField label="Buscar música" value={query} onChangeText={setQuery} placeholder="nome da música" />
      <Button title="Buscar" variant="secondary" onPress={search} disabled={busy} />

      {results && results.length === 0 ? (
        <Text style={styles.hint}>Nenhuma música encontrada. Cadastre uma nova abaixo.</Text>
      ) : null}
      {results
        ? results.map((track) => (
            <TrackItem
              key={track.id}
              name={track.name}
              artistName={track.artist ? track.artist.name : ''}
              selected={selected !== null && selected.id === track.id}
              onPress={() => setSelected({ id: track.id, name: track.name, artistName: track.artist ? track.artist.name : '' })}
            />
          ))
        : null}

      <Button
        title={showNew ? 'Fechar cadastro' : 'Cadastrar nova música'}
        variant="ghost"
        onPress={() => setShowNew(!showNew)}
        disabled={busy}
      />
      {showNew ? (
        <View style={styles.newBox}>
          <Text style={styles.step}>1. Escolha o artista (ele precisa já estar cadastrado)</Text>
          <ArtistPicker
            genres={genres}
            selected={artist}
            onSelect={setArtist}
            onSearch={onSearchArtists}
            onCreate={onCreateArtist}
          />
          <Text style={styles.step}>2. Nome da música</Text>
          <TextField label="Música" value={trackName} onChangeText={setTrackName} autoCapitalize="words" />
          <Button title="Cadastrar música e selecionar" onPress={createTrack} loading={busy} disabled={!artist} />
        </View>
      ) : null}

      {selected ? (
        <View style={styles.registerBox}>
          <Text style={styles.selectedLabel}>Música selecionada</Text>
          <Text style={styles.selectedName}>
            {selected.name}
            {selected.artistName ? ` — ${selected.artistName}` : ''}
          </Text>
          <TextField
            label="Quanto tempo você ouviu (segundos)"
            value={seconds}
            onChangeText={setSeconds}
            keyboardType="numeric"
          />
          <Button title="Registrar escuta" onPress={register} loading={busy} />
        </View>
      ) : null}

      <Message type={feedback.type} text={feedback.text} />
    </Section>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.muted,
    fontSize: 14,
  },
  newBox: {
    gap: spacing.md,
  },
  step: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  registerBox: {
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  selectedName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
