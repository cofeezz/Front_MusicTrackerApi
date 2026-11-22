import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import Button from './Button';
import Chips from './Chips';
import Message from './Message';
import TextField from './TextField';
import TrackItem from './TrackItem';

export default function ArtistPicker({ genres, selected, onSelect, onSearch, onCreate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [genre, setGenre] = useState(genres[0].value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const genreLabel = (value) => {
    const found = genres.find((item) => item.value === value);
    return found ? found.label : value;
  };

  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  };

  const search = () =>
    run(async () => {
      if (!query.trim()) {
        throw new Error('Digite o nome do artista para buscar.');
      }
      setResults(await onSearch(query.trim()));
    });

  const create = () =>
    run(async () => {
      if (!newName.trim()) {
        throw new Error('Informe o nome do artista.');
      }
      const artist = await onCreate({ name: newName.trim(), genre });
      onSelect(artist);
      setShowNew(false);
      setNewName('');
      setQuery('');
      setResults(null);
    });

  if (selected) {
    return (
      <View style={styles.box}>
        <Text style={styles.label}>Artista escolhido</Text>
        <Text style={styles.name}>{selected.name}</Text>
        <Button title="Trocar artista" variant="ghost" onPress={() => onSelect(null)} />
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <TextField label="Buscar artista" value={query} onChangeText={setQuery} placeholder="nome do artista" />
      <Button title="Buscar artista" variant="secondary" onPress={search} disabled={busy} />
      {results && results.length === 0 ? (
        <Text style={styles.hint}>Nenhum artista encontrado. Cadastre o artista abaixo.</Text>
      ) : null}
      {results
        ? results.map((artist) => (
            <TrackItem
              key={artist.id}
              name={artist.name}
              artistName={genreLabel(artist.genre)}
              selected={false}
              onPress={() => onSelect({ id: artist.id, name: artist.name })}
            />
          ))
        : null}
      <Button
        title={showNew ? 'Fechar cadastro de artista' : 'Cadastrar novo artista'}
        variant="ghost"
        onPress={() => setShowNew(!showNew)}
        disabled={busy}
      />
      {showNew ? (
        <View style={styles.box}>
          <TextField label="Nome do artista" value={newName} onChangeText={setNewName} autoCapitalize="words" />
          <Chips label="Gênero" options={genres} value={genre} onChange={setGenre} />
          <Button title="Cadastrar artista" onPress={create} loading={busy} />
        </View>
      ) : null}
      <Message type="error" text={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    color: colors.muted,
    fontSize: 14,
  },
});
