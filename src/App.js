import React, { useEffect, useState } from 'react';
import { withLDProvider, useLDClient } from 'launchdarkly-react-client-sdk';

const users = {
  alice: {
    key: 'user789',
    name: 'Alice',
    team: 'marketing',
    location: 'SF',
    plan: 'pro'
  },
  bob: {
    key: 'user999',
    name: 'Bob',
    team: 'finance',
    location: 'NYC',
    plan: 'basic'
  },
  carol: {
    key: 'user222',
    name: 'Carol',
    team: 'engineering',
    location: 'Chicago',
    plan: 'basic'
  },
  customerA: {
    key: 'vip-123',
    name: 'Customer A',
    team: 'vip',
    location: 'LA',
    plan: 'premium'
  }
};

function Testimonials() {
  return (
    <div style={{ marginTop: '2rem', padding: '1rem', background: '#e0f2fe', borderRadius: '8px' }}>
      <h2>🌟 What Our Customers Say</h2>
      <p>“This platform completely changed the way we work!”</p>
    </div>
  );
}

function SupportAssistant({ ldClient }) {
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    if (ldClient) {
      ldClient.track('support_assistant_clicked');
      await ldClient.flush();
      console.log('✅ support_assistant_clicked event tracked and flushed');
    }
    setOpen(!open);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#1d4ed8',
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '50px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          zIndex: 1000
        }}
        onClick={handleClick}
      >
        💬 Chat
      </div>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '2rem',
            backgroundColor: '#fef3c7',
            padding: '1rem',
            borderRadius: '8px',
            width: '250px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 999
          }}
        >
          <strong>Hi! Need help?</strong>
          <p>We’re here for you — ask us anything or visit our support center.</p>
          <button
            onClick={() => alert('Simulating support redirect...')}
            style={{
              backgroundColor: '#1d4ed8',
              color: 'white',
              border: 'none',
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px'
            }}
          >
            Open Help Center
          </button>
        </div>
      )}
    </>
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
        july_4th_sale: ldClient.variation('july_4th_sale', false),
        show_support_assistant: ldClient.variation('show_support_assistant', false),
        testimonials_section: ldClient.variation('testimonials_section', false)
      };
      setFlags(allFlags);
    };

    updateFlags();
    ldClient.on('change', updateFlags);
    return () => ldClient.off('change', updateFlags);
  }, [ldClient, isReady]);

  useEffect(() => {
    if (flags.testimonials_section && ldClient) {
      ldClient.track('viewed_testimonials');
      ldClient.flush();
    }
    if (flags.show_support_assistant && ldClient) {
      ldClient.track('support_assistant_viewed');
      ldClient.flush();
    }
  }, [flags.testimonials_section, flags.show_support_assistant]);

  const switchUser = async (userKey) => {
    const user = users[userKey];
    if (ldClient) {
      await ldClient.identify({ kind: 'user', ...user });
      setSelectedUser(userKey);
      setIsReady(true);
    }
  };

  useEffect(() => {
    switchUser(selectedUser);
  }, []);

  const testSingleUser = async () => {
  const context = {
    kind: 'user',
    key: 'maggie-test-user',
    name: 'Maggie (Test)'
  };

  await ldClient.identify(context);
  await new Promise((res) => setTimeout(res, 300));

  const variation = await ldClient.variation('show_support_assistant', false);
  console.log(`🧪 maggie-test-user got variation: ${variation}`);

  if (variation === true) {
    ldClient.track('support_assistant_clicked');
    await ldClient.flush();
    console.log('✅ Event sent for maggie-test-user');
  } else {
    console.log('⚠️ Not in treatment group');
  }
  };
  const products = [
    { name: 'Jetset Hoodie', image: '/hoodie.jpg', price: '$64' },
    { name: 'Cloud Joggers', image: '/joggers.jpg', price: '$54' },
    { name: 'Studio Crop', image: '/crop.jpg', price: '$42' }
  ];

 const simulateDemoClicks = async () => {
  if (!ldClient) return;

  for (let i = 1; i <= 20; i++) {
    const context = {
      kind: 'user',
      key: `demo-user-${i}`,
      name: `Demo User ${i}`
    };

    await ldClient.identify(context);

    // Wait briefly to allow the SDK to evaluate flags and bucket user into experiment
    await new Promise((res) => setTimeout(res, 300));

    // Evaluate the flag variation
    const variation = await ldClient.variation('show_support_assistant', false);
    console.log(`User ${context.key} got variation: ${variation}`);

    // Only track the event if the user was served the treatment (e.g., true variation)
    if (variation === true) {
      ldClient.track('support_assistant_clicked');
      await ldClient.flush();
      console.log(`✅ Tracked click for ${context.key}`);
    } else {
      console.log(`⏭️ Skipped tracking for ${context.key} (not in treatment group)`);
    }

    // Small buffer before next loop
    await new Promise((res) => setTimeout(res, 200));
  }
};


  return (
    <div style={{ ...styles.wrapper, backgroundImage: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)' }}>
      <div style={styles.page}>
        {/* Navigation Bar */}
        <div style={{
          width: '100%', padding: '1rem 2rem', backgroundColor: '#1f2937',
          color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between',
          marginBottom: '2rem', borderRadius: '0.5rem'
        }}>
          <div>Jetset Retail <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', marginLeft: '0.5rem' }}>🛒 2</span></div>
          <div><a href="#" style={{ color: 'white', marginRight: '1rem' }}>Shop</a><a href="#" style={{ color: 'white', marginRight: '1rem' }}>About</a><a href="#" style={{ color: 'white' }}>Login</a></div>
        </div>

        {/* Hero Banner */}
        <div style={{ backgroundColor: '#e0f2fe', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>✨ Fall Drop Now Live</h2>
          <p>Shop the newest arrivals from our top creators.</p>
        </div>

        {/* Persona Selector */}
        <label style={{ display: 'block', marginBottom: '1.5rem' }}>
          <strong>Select Demo User:</strong>
          <select onChange={(e) => switchUser(e.target.value)} value={selectedUser} style={{ marginLeft: '0.5rem' }}>
            {Object.keys(users).map((key) => (
              <option key={key} value={key}>{users[key].name} ({users[key].team})</option>
            ))}
          </select>
        </label>

        {/* 🇺🇸 July 4th Sale Banner */}
          {flags.july_4th_sale && (
            <div style={{
              backgroundColor: '#b91c1c',
              color: '#fff',
              padding: '1rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              🎆 4th of July Sale! Enjoy big savings this holiday 🎇
            </div>
          )}


        {/* Product Grid */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          {products.map((product, idx) => (
            <div key={idx} style={{ backgroundColor: '#fff', padding: '0.75rem', borderRadius: '0.75rem', width: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />
              <strong>{product.name}</strong><br />
              <span style={{ color: '#6b7280' }}>{product.price}</span><br />
              <button style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s', padding: '0.4rem 0.8rem' }}>Add to Cart</button>
              <p style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: '#10b981' }}>In Stock</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        {flags.testimonials_section && <Testimonials />}

        {/* Simulate Clicks */}
        <button
          onClick={simulateDemoClicks}
          style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🚀 Simulate Clicks
        </button>
      </div>
      <button
        onClick={testSingleUser}
        style={{
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
      >
      🧪 Test Single User Event
    </button>

      {/* Support Assistant */}
      {flags.show_support_assistant && <SupportAssistant ldClient={ldClient} />}
    </div>
  );
}

export default withLDProvider({

  clientSideID: '67ebfadb90496b098b851515',
  reactOptions: {
    useCamelCaseFlagKeys: false
  }

})(App);

const styles = {
  wrapper: {
    minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', backgroundImage: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)'
  },
  page: {
    maxWidth: '900px', width: '100%', padding: '1rem'
  },
  flagOn: {
    backgroundColor: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem'
  },
  flagOff: {
    backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem'
  }
};



