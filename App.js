import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ApiError,
  createApiKey,
  createArtist,
  createListen,
  createTrack,
  fetchRanking,
  findUserId,
  registerUser,
  revokeApiKey,
  searchTracks,
} from './src/api';
import AuthSection from './src/components/AuthSection';
import Header from './src/components/Header';
import ListenSection from './src/components/ListenSection';
import RankingSection from './src/components/RankingSection';
import TabBar from './src/components/TabBar';
import { colors, spacing } from './src/theme';

const TABS = [
  { key: 'listen', label: 'Escutar' },
  { key: 'ranking', label: 'Ranking' },
];

const PERIODS = [
  { key: 'all', label: 'De sempre' },
  { key: 'month', label: 'Este mês' },
];

const GENRES = [
  { value: 'POP', label: 'Pop' },
  { value: 'ROCK', label: 'Rock' },
  { value: 'HIP_HOP', label: 'Hip-hop' },
  { value: 'ELECTRONIC', label: 'Eletrônica' },
  { value: 'INDIE', label: 'Indie' },
  { value: 'MPB', label: 'MPB' },
  { value: 'JAZZ', label: 'Jazz' },
  { value: 'OTHER', label: 'Outro' },
];

export default function App() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('listen');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [period, setPeriod] = useState('all');
  const [ranking, setRanking] = useState({ items: [], loading: false, error: '' });

  const expireSession = useCallback(() => {
    setSession(null);
    setAuthNotice('Sua sessão expirou (o servidor pode ter sido reiniciado). Entre novamente.');
  }, []);

  const guarded = useCallback(
    async (action) => {
      try {
        return await action();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          expireSession();
        }
        throw error;
      }
    },
    [expireSession]
  );

  const startSession = async (username, password, knownUserId) => {
    const key = await createApiKey({ username, password, name: 'app' });
    const userId = knownUserId !== undefined ? knownUserId : await findUserId(username, key.key);
    setSession({ userId, username, apiKey: key.key, keyId: key.id });
    setTab('listen');
  };

  const runAuth = async (action) => {
    setAuthLoading(true);
    setAuthError('');
    setAuthNotice('');
    try {
      await action();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = ({ username, password }) =>
    runAuth(async () => {
      if (!username || !password) {
        throw new Error('Informe o nome de usuário e a senha.');
      }
      await startSession(username, password);
    });

  const handleRegister = ({ username, email, password }) =>
    runAuth(async () => {
      if (!username || !email || !password) {
        throw new Error('Preencha nome de usuário, e-mail e senha.');
      }
      const user = await registerUser({ username, email, password });
      await startSession(username, password, user.id);
    });

  const handleLogout = async () => {
    const current = session;
    setSession(null);
    setAuthNotice('');
    setRanking({ items: [], loading: false, error: '' });
    if (current) {
      try {
        await revokeApiKey(current.keyId, current.apiKey);
      } catch (error) {
        return;
      }
    }
  };

  const handleSearch = (name) => searchTracks(name);

  const handleCreateTrack = ({ artistName, trackName, genre }) =>
    guarded(async () => {
      const artist = await createArtist({ name: artistName, genre }, session.apiKey);
      const track = await createTrack({ name: trackName, artistId: artist.id }, session.apiKey);
      return { id: track.id, name: track.name, artistName: artist.name };
    });

  const handleRegisterListen = ({ trackId, durationSeconds }) =>
    guarded(() => createListen({ userId: session.userId, trackId, durationSeconds }, session.apiKey));

  const loadRanking = useCallback(async () => {
    if (!session) {
      return;
    }
    setRanking((current) => ({ ...current, loading: true, error: '' }));
    try {
      const items = await guarded(() =>
        fetchRanking(
          { userId: session.userId, monthly: period === 'month', limit: period === 'month' ? 3 : 10 },
          session.apiKey
        )
      );
      setRanking({ items, loading: false, error: '' });
    } catch (error) {
      setRanking({ items: [], loading: false, error: error.message });
    }
  }, [session, period, guarded]);

  useEffect(() => {
    if (session && tab === 'ranking') {
      loadRanking();
    }
  }, [session, tab, period, loadRanking]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Header title="Music Tracker" username={session ? session.username : ''} onLogout={handleLogout} />
            {session ? (
              <>
                <TabBar tabs={TABS} active={tab} onChange={setTab} />
                {tab === 'listen' ? (
                  <ListenSection
                    title="Registrar escuta"
                    subtitle="Busque a música que você ouviu ou cadastre uma nova."
                    genres={GENRES}
                    onSearch={handleSearch}
                    onCreateTrack={handleCreateTrack}
                    onRegister={handleRegisterListen}
                  />
                ) : (
                  <RankingSection
                    title="Suas faixas mais ouvidas"
                    subtitle="O ranking é pessoal: conta só as suas escutas."
                    periods={PERIODS}
                    period={period}
                    onPeriodChange={setPeriod}
                    items={ranking.items}
                    loading={ranking.loading}
                    error={ranking.error}
                    onRefresh={loadRanking}
                  />
                )}
              </>
            ) : (
              <AuthSection
                title="Entrar"
                subtitle="Acompanhe as músicas que você ouve e veja suas favoritas."
                loading={authLoading}
                error={authError}
                notice={authNotice}
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    gap: spacing.lg,
  },
});
