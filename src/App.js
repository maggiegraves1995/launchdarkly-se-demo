import React, { useEffect, useState } from 'react';
import { withLDProvider, useLDClient } from 'launchdarkly-react-client-sdk';

const users = {
  alice: {
    key: 'user789',
    name: 'Alice',
    team: 'marketing',
    location: 'SF'
  },
  bob: {
    key: 'user999',
    name: 'Bob',
    team: 'finance',
    location: 'NYC'
  },
  carol: {
    key: 'user222',
    name: 'Carol',
    team: 'engineering',
    location: 'Chicago'
  }
};

function Testimonials() {
  return (
    <div style={{ marginTop: '2rem', padding: '1rem', background: '#e0f2fe', borderRadius: '8px' }}>
      <h2>🌟 What Our Users Say</h2>
      <p>“This product changed our workflow forever!”</p>
    </div>
  );
}

function App() {
  const ldClient = useLDClient();
  const [selectedUser, setSelectedUser] = useState('alice');
  const [flags, setFlags] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!ldClient || !isReady) return;

    const updateFlags = () => {
      const allFlags = {
        feature_demo: ldClient.variation('feature_demo', false),
        testimonials_section: ldClient.variation('testimonials_section', false)
      };
      setFlags(allFlags);
    };

    updateFlags();
    ldClient.on('change', updateFlags);

    return () => {
      ldClient.off('change', updateFlags);
    };
  }, [ldClient, isReady]);

  useEffect(() => {
    if (flags.testimonials_section && ldClient) {
      ldClient.track('viewed_testimonials');
    }
  }, [flags.testimonials_section]);

  const switchUser = async (userKey) => {
    const user = users[userKey];
    await ldClient?.identify({ kind: 'user', ...user });
    setSelectedUser(userKey);
    setIsReady(true);
  };

  useEffect(() => {
    switchUser(selectedUser);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 LaunchDarkly Feature Toggle Demo</h1>
        <p style={styles.subtitle}>
          This demo shows real-time flag switching using the LaunchDarkly SDK.
        </p>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <strong>Select Demo User:</strong>
          <select
            onChange={(e) => switchUser(e.target.value)}
            value={selectedUser}
            style={{ marginLeft: '0.5rem' }}
          >
            {Object.keys(users).map((key) => (
              <option key={key} value={key}>
                {users[key].name} ({users[key].team})
              </option>
            ))}
          </select>
        </label>

        <div style={flags.feature_demo ? styles.flagOn : styles.flagOff}>
          {flags.feature_demo ? '✅ Feature is ON' : '❌ Feature is OFF'}
        </div>

        {flags.testimonials_section && <Testimonials />}
      </div>
    </div>
  );
}

export default withLDProvider({
  clientSideID: 'YOUR_CLIENT_SIDE_ID', // client side ID for Prod
  reactOptions: {
    useCamelCaseFlagKeys: false
  }
})(App);

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem 3rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '2rem'
  },
  flagOn: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '1rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  flagOff: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '1rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  }
};

